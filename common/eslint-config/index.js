module.exports = {
  root: true,

  env: {
    es6: true,
    node: true,
    browser: true,
  },

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
    "react-app",
  ],
  plugins: ["@typescript-eslint", "import", "react", "react-hooks"],
  settings: {
    "import/resolver": { typescript: {} },
    react: { version: "detect" },
  },
  rules: {
    "no-implicit-coercion": "error",
    "no-warning-comments": [
      "warn",
      {
        terms: ["TODO", "FIXME", "XXX", "BUG"],
        location: "anywhere",
      },
    ],
    curly: ["error", "all"],
    eqeqeq: ["error", "always", { null: "ignore" }],
    // Modal에서는 any가 필요함.
    "@typescript-eslint/no-explicit-any": "off",
    // Hoisting을 전략적으로 사용한 경우가 많아서
    "@typescript-eslint/no-use-before-define": "off",
    // 모델 정의 부분에서 class와 interface를 합치기 위해 사용하는 용법도 잡고 있어서
    "@typescript-eslint/no-empty-interface": "off",
    // 모델 정의 부분에서 파라미터 프로퍼티를 잘 쓰고 있어서
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-var-requires": "warn",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
    "@typescript-eslint/no-inferrable-types": "warn",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        selector: "variable",
        leadingUnderscore: "allow",
      },
      { format: ["camelCase", "PascalCase"], selector: "function" },
      { format: ["PascalCase"], selector: "interface" },
      { format: ["PascalCase"], selector: "typeAlias" },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/array-type": ["error", { default: "array" }],
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/member-ordering": [
      "warn",
      {
        default: [
          "public-static-field",
          "protected-static-field",
          "private-static-field",
          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",
          "constructor",
          "public-static-method",
          "protected-static-method",
          "private-static-method",
          "public-instance-method",
          "protected-instance-method",
          "private-instance-method",
        ],
      },
    ],

    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
        ],
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],

    "react/prop-types": "off",
    // React.memo, React.forwardRef에서 사용하는 경우도 막고 있어서
    "react/display-name": "off",
    "react-hooks/exhaustive-deps": "error",
    "react/react-in-jsx-scope": "off",
    "react/no-unknown-property": ["error", { ignore: ["css"] }],
  },
};
