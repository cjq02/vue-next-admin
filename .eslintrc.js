// https://blog.csdn.net/Sheng_zhenzhen/article/details/108685176
//
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    // eslint-config-prettier 的缩写
    'prettier',
    '@vue/typescript/recommended',
    '.eslintrc-auto-import.json',
    '.eslintrc-auto-import-types.json',
    'vue-global-api',
  ],
  globals: {
    defineEmits: true,
    defineExpose: true,
    defineModel: true,
    defineProps: true,
    document: true,
    localStorage: true,
    window: true,
    withDefaults: true,
  },
  overrides: [
    {
      env: {
        jest: true,
      },
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
    },
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  // eslint-plugin-vue @typescript-eslint/eslint-plugin eslint-plugin-prettier的缩写
  plugins: [
    'vue',
    '@typescript-eslint',
    'prettier',
    'import',
    'simple-import-sort',
    'typescript-sort-keys',
    'sort-keys-plus',
    '@stylistic/js',
  ],
  root: true,
  rules: {
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/no-empty-function': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-non-null-assertion': ['off'],
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        // Disallow `const { props, state } = this`; true by default
        allowDestructuring: false,
        // Allow `const self = this`; `[]` by default
        allowedNames: ['that'],
      },
    ],
    // can config  to 2 if need more then required
    '@typescript-eslint/no-unused-vars': [0],
    'accessor-pairs': 2,
    // 强制数组方括号中使用一致的空格
    'array-bracket-spacing': 'warn',
    'arrow-spacing': [
      2,
      {
        after: true,
        before: true,
      },
    ],
    'block-spacing': [2, 'always'],
    // 强制在代码块中使用一致的大括号风格
    'brace-style': 'warn',
    camelcase: [
      'error',
      {
        properties: 'always',
      },
    ],
    /* 'comma-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    'comma-style': [2, 'last'],*/
    /* 'comma-dangle': ['error', 'always'],*/
    'constructor-super': 2,
    curly: [2, 'multi-line'],
    // 要求 switch 语句中有 default 分支
    'default-case': 'warn',
    'dot-location': [2, 'property'],
    'eol-last': 2,
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'generator-star-spacing': [
      2,
      {
        after: true,
        before: true,
      },
    ],
    'handle-callback-err': [2, '^(err|error)$'],
    'import/extensions': 'off',
    'import/named': 'off',
    'import/newline-after-import': ['error', { count: 1 }],
    'import/no-absolute-path': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
    'jsx-quotes': [2, 'prefer-double'],
    'key-spacing': [
      2,
      {
        afterColon: true,
        beforeColon: false,
      },
    ],
    'keyword-spacing': [
      2,
      {
        after: true,
        before: true,
      },
    ],
    'line-comment-position': ['error', { position: 'above' }],
    'linebreak-style': ['off', 'windows'],
    // 强制可嵌套的块的最大深度4
    'max-depth': ['error', 4],
    'new-cap': [
      2,
      {
        capIsNew: false,
        newIsCap: true,
      },
    ],
    'new-parens': 2,
    'no-array-constructor': 2,
    'no-async-promise-executor': 'off',
    'no-bitwise': 'off',
    'no-caller': 2,
    'no-case-declarations': 'warn',
    'no-class-assign': 2,
    'no-cond-assign': 2,
    'no-console': 'off',
    'no-const-assign': 2,
    'no-control-regex': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 允许delete变量
    'no-delete-var': 'off',
    'no-dupe-args': 2,
    'no-dupe-class-members': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    // 禁止 if 语句中 return 语句之后有 else 块
    'no-else-return': 'warn',
    'no-empty-character-class': 2,
    // 禁止出现空函数
    'no-empty-function': 'off',
    'no-empty-pattern': 2,
    'no-eval': 2,
    'no-ex-assign': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, 'functions'],
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'no-func-assign': 2,
    'no-implied-eval': 2,
    'no-inner-declarations': [2, 'functions'],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-iterator': 2,
    'no-label-var': 2,
    'no-labels': [
      2,
      {
        allowLoop: false,
        allowSwitch: false,
      },
    ],
    // 禁用不必要的嵌套块
    'no-lone-blocks': 'warn',
    'no-mixed-spaces-and-tabs': 2,
    // 禁止使用多个空格
    'no-multi-spaces': 'warn',
    /* 'no-multi-str': 2,*/
    'no-multiple-empty-lines': [
      2,
      {
        max: 1,
      },
    ],

    'no-native-reassign': 2,
    'no-negated-in-lhs': 2,
    'no-new-object': 2,
    'no-new-require': 2,
    'no-new-symbol': 2,
    'no-new-wrappers': 2,
    'no-obj-calls': 2,
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-param-reassign': ['off'],
    'no-path-concat': 2,
    'no-plusplus': 'off',
    'no-proto': 2,
    'no-prototype-builtins': 'warn',
    // 禁止多次声明同一变量
    'no-redeclare': 'warn',
    'no-regex-spaces': 2,
    // 禁止在 return 语句中使用赋值语句
    'no-return-assign': 'off',
    // 禁用不必要的 return await
    'no-return-await': 'warn',
    // 禁止自我赋值
    'no-self-assign': 'warn',
    // 禁止自身比较
    'no-self-compare': 'warn',
    'no-sequences': 2,
    // 禁止变量声明与外层作用域的变量同名
    'no-shadow': 'off',
    'no-shadow-restricted-names': 2,
    'no-spaced-func': 2,
    'no-sparse-arrays': 2,
    'no-this-before-super': 2,
    'no-throw-literal': 2,
    'no-trailing-spaces': 2,
    'no-undef': 2,
    'no-undef-init': 2,
    'no-unexpected-multiline': 2,
    'no-unmodified-loop-condition': 2,
    'no-unneeded-ternary': [
      2,
      {
        defaultAssignment: false,
      },
    ],
    'no-unreachable': 2,
    'no-unsafe-finally': 2,
    'no-unused-vars': [
      2,
      {
        args: 'none',
        vars: 'all',
      },
    ],

    'no-useless-call': 2,
    // 禁止不必要的 catch 子句
    'no-useless-catch': 'warn',
    'no-useless-computed-key': 2,
    'no-useless-constructor': 2,
    'no-useless-escape': 'off',
    // 禁止多余的 return 语句
    'no-useless-return': 'off',
    'no-var': 'error',
    'no-whitespace-before-property': 2,
    'no-with': 2,
    'object-curly-spacing': 'off',
    // 强制在代码块中使用一致的大括号风格
    'one-var': [
      2,
      {
        initialized: 'never',
      },
    ],
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          ':': 'before',
          '?': 'before',
        },
      },
    ],
    'padded-blocks': [2, 'never'],
    'padding-line-between-statements': ['error', { blankLine: 'always', next: 'function', prev: 'function' }],
    'prefer-const': 'warn',
    'prefer-rest-params': 'off',
    'prettier/prettier': 'error',
    quotes: [
      2,
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
    semi: [2, 'never'],
    'semi-spacing': [
      2,
      {
        after: true,
        before: false,
      },
    ],

    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-keys-plus/sort-keys': 'error',
    /* 'brace-style': [2, '1tbs', {
      'allowSingleLine': true
    }],*/
    // 强制在块之前使用一致的空格
    'space-before-blocks': 'warn',
    /* 'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'always'
      }
    ],*/
    'space-in-parens': [2, 'never'],
    'space-infix-ops': 2,
    'space-unary-ops': [
      2,
      {
        nonwords: false,
        words: true,
      },
    ],
    'spaced-comment': [
      2,
      'always',
      {
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ','],
      },
    ],
    'template-curly-spacing': [2, 'never'],
    'use-isnan': 2,
    'valid-typeof': 2,
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': [
      2,
      {
        multiline: {
          max: 1,
        },
        singleline: {
          max: 10,
        },
      },
    ],
    'vue/multi-word-component-names': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-multiple-template-root': 'off',
    'vue/no-mutating-props': 'off',
    'vue/no-parsing-error': 'off',
    'vue/no-setup-props-destructure': ['off'],
    'vue/no-v-for-template-key': 'off',
    'vue/no-v-html': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/v-on-event-hyphenation': ['error'],
    'vue/valid-define-emits': 'off',
    'vue/valid-define-props': 'off',
    'wrap-iife': [2, 'any'],
    'yield-star-spacing': [2, 'both'],
    yoda: [2, 'never'],
  },
}
