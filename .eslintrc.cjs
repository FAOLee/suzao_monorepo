module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  globals: {
    // Nuxt 3 global composables
    useRuntimeConfig: 'readonly',
    useRoute: 'readonly',
    useRouter: 'readonly',
    useI18n: 'readonly',
    useNuxtApp: 'readonly',
    navigateTo: 'readonly',
    // Vue 3 global composables
    ref: 'readonly',
    computed: 'readonly',
    onMounted: 'readonly',
    watch: 'readonly',
    nextTick: 'readonly',
    // Other global utilities
    $fetch: 'readonly',
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier', // 关闭与 Prettier 冲突的规则
    'plugin:prettier/recommended', // 启用 Prettier 规则并显示为 ESLint 错误
  ],
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    // 基础规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-const': 'error',
    'no-unused-vars': 'off', // 关闭基础规则，使用 TypeScript 版本
    
    // TypeScript 规则
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // Vue.js 规则
    'vue/multi-word-component-names': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    
    // Prettier 规则（会自动与 .prettierrc 配置同步）
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // Vue 文件特定规则
        '@typescript-eslint/no-unused-vars': 'off', // Vue setup 中的响应式变量可能看起来未使用
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // TypeScript 文件特定规则
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
