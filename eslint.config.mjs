// eslint.config.mjs
import next from 'eslint-config-next';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  // Next.js 권장 규칙
  ...next,

  // 무시할 경로
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'coverage/**']
  },

  // 공통 규칙
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    rules: {
      // import 순서/그룹 자동 정렬
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn'
    }
  }
];
