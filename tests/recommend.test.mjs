import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));
const production = process.env.TEST_SERVER_MODE === 'production';
const validAnswers = {
  appType: 'saas',
  expectedUsers: '0-1k',
  realTimeFeatures: false,
  budget: 'low',
  teamSize: 'solo',
  aiIntegration: false,
  compliance: 'none',
  timeToMarket: 'fast',
};

let directory;
let server;
let baseUrl;
let output = '';

before(async () => {
  // Isolate Next's build cache and SQLite writes from the working tree.
  directory = await mkdtemp(path.join(process.env.TMPDIR || tmpdir(), 'stuckatstack-test-'));
  if (production) {
    await cp(path.join(root, '.next/standalone'), directory, { recursive: true });
    await cp(path.join(root, '.next/static'), path.join(directory, '.next/static'), { recursive: true });
  } else {
    for (const entry of ['src', 'package.json', 'next.config.js', 'tsconfig.json', 'next-env.d.ts', 'postcss.config.js', 'tailwind.config.js']) {
      await cp(path.join(root, entry), path.join(directory, entry), { recursive: true });
    }
    await symlink(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'dir');
  }

  const listener = createServer();
  listener.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  const port = listener.address().port;
  await new Promise((resolve, reject) => listener.close(error => error ? reject(error) : resolve()));
  baseUrl = `http://127.0.0.1:${port}`;
  const args = production
    ? [path.join(directory, 'server.js')]
    : [require.resolve('next/dist/bin/next'), 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', String(port)];
  server = spawn(process.execPath, args, {
    cwd: directory,
    env: {
      ...process.env,
      NODE_ENV: production ? 'production' : 'development',
      NEXT_TELEMETRY_DISABLED: '1',
      HOSTNAME: '127.0.0.1',
      PORT: String(port),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', chunk => { output += chunk; });
  server.stderr.on('data', chunk => { output += chunk; });
  server.on('error', error => { output += error.message; });

  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Test server exited: ${output}`);
    try {
      // Warm only the route under test; avoid the layout's Google Fonts fetch.
      const response = await fetch(`${baseUrl}/api/recommend`, { signal: AbortSignal.timeout(20_000) });
      if (response.status === 405) return;
    } catch { /* Wait for Next to compile the route. */ }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`Test server did not start: ${output}`);
}, { timeout: 120_000 });

after(async () => {
  if (server && server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    const timeout = setTimeout(() => server.kill('SIGKILL'), 10_000);
    try { await exited; } finally { clearTimeout(timeout); }
  }
  if (directory) await rm(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
});

async function recommend(body) {
  return fetch(`${baseUrl}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
}

test('health endpoint returns an uncached liveness response', async () => {
  const response = await fetch(`${baseUrl}/api/health`, { signal: AbortSignal.timeout(10_000) });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('valid answers keep literal booleans and return the recommendation contract', async () => {
  const response = await recommend(validAnswers);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body.answers, validAnswers);
  assert.equal(body.recommendation.backend, 'Node.js + Express');
  assert.equal(body.recommendation.backendDetails.chosen.name, body.recommendation.backend);
  for (const field of ['frontend', 'database', 'deployment', 'reasoning', 'scalingStrategy', 'estimatedHosting']) {
    assert.equal(typeof body.recommendation[field], 'string');
    assert.ok(body.recommendation[field].length > 0);
  }
  assert.equal(new Date(body.timestamp).toISOString(), body.timestamp);
});

for (const [name, value] of Object.entries({ null: null, array: [], string: 'answers', number: 42, boolean: false })) {
  test(`rejects a ${name} request body`, async () => {
    const response = await recommend(value);
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, 'Invalid questionnaire answers');
  });
}

for (const field of Object.keys(validAnswers)) {
  test(`rejects missing ${field}`, async () => {
    const answers = { ...validAnswers };
    delete answers[field];
    const response = await recommend(answers);
    assert.equal(response.status, 400);
    assert.ok((await response.json()).issues.some(issue => issue.path[0] === field));
  });
  test(`rejects null ${field}`, async () => {
    const response = await recommend({ ...validAnswers, [field]: null });
    assert.equal(response.status, 400);
    assert.ok((await response.json()).issues.some(issue => issue.path[0] === field));
  });
  test(`rejects an invalid value for ${field}`, async () => {
    const response = await recommend({ ...validAnswers, [field]: 'invalid' });
    assert.equal(response.status, 400);
    assert.ok((await response.json()).issues.some(issue => issue.path[0] === field));
  });
}

for (const field of ['aiIntegration', 'realTimeFeatures']) {
  test(`rejects numeric ${field} instead of coercing it`, async () => {
    assert.equal((await recommend({ ...validAnswers, [field]: 1 })).status, 400);
  });
  test(`accepts literal true for ${field}`, async () => {
    const response = await recommend({ ...validAnswers, [field]: true });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).answers[field], true);
  });
}

test('rejects unknown fields rather than silently accepting a misspelled question', async () => {
  const response = await recommend({ ...validAnswers, unexpected: 'value' });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'Invalid questionnaire answers');
});

test('returns 400 for an empty request body', async () => {
  const response = await fetch(`${baseUrl}/api/recommend`, { method: 'POST' });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'Request body must be valid JSON');
});

test('returns 400 for malformed JSON instead of a server error', async () => {
  const response = await fetch(`${baseUrl}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'Request body must be valid JSON');
});

test('rejects string booleans instead of treating "false" as true', async () => {
  const response = await recommend({ ...validAnswers, aiIntegration: 'false' });
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(typeof body.error, 'string');
  assert.ok(body.issues.some(issue => issue.path[0] === 'aiIntegration'));
});
