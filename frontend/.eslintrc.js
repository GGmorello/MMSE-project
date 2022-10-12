module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["plugin:react/recommended", "standard-with-typescript"],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
    },
    plugins: ["react"],
    rules: {
        "no-unused-vars": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "multiline-ternary": ["error", "never"],
        "space-before-function-paren": "off",
        "@typescript-eslint/space-before-function-paren": "off",
        "@typescript-eslint/member-delimiter-style": [
            "warn",
            {
                multiline: { delimiter: "semi", requireLast: true },
                singleline: { delimiter: "semi", requireLast: true },
                multilineDetection: "brackets",
                overrides: {
                    interface: {
                        multiline: {
                            delimiter: "semi",
                            requireLast: true,
                        },
                    },
                },
            },
        ],
        indent: ["error", 4, { SwitchCase: 1 }],
        "@typescript-eslint/indent": ["error", 4],
        quotes: ["error", "double"],
        "@typescript-eslint/quotes": ["error", "double"],
        "comma-dangle": ["error", "always-multiline"],
        "@typescript-eslint/comma-dangle": ["error", "always-multiline"],
        semi: ["error", "always"],
        "@typescript-eslint/semi": ["error", "always"],
    },
};
