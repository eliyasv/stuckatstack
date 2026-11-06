// Node is already present in the runtime image; no curl/wget dependency.
const port = process.env.PORT || '3000';

fetch(`http://127.0.0.1:${port}/api/health`, {
  signal: AbortSignal.timeout(3000),
  redirect: 'error',
})
  .then(response => process.exit(response.status === 200 ? 0 : 1))
  .catch(() => process.exit(1));
