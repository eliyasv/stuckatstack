import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    files: ['src/app/results/page.tsx'],
    rules: {
      // Preserve the existing mount-only sessionStorage hydration during this
      // dependency migration. Result-loading/recovery is a separate fix.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
]);
