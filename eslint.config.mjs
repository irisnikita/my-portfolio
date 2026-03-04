import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // ── Global ignores ──
  { ignores: ["dist/", ".astro/", "node_modules/", ".vercel/", "public/"] },

  // ── Base JS/TS rules ──
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // ── Browser + Node globals (URL, Request, console, etc.) ──
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // ── Astro ──
  ...eslintPluginAstro.configs.recommended,

  // ── Astro template false-positive suppressions ──
  {
    files: ["**/*.astro"],
    rules: {
      // Astro template expressions are flagged as "unused" — false positive
      "@typescript-eslint/no-unused-expressions": "off",
      // Astro inline scripts don't always have the full global scope
      "no-undef": "off",
    },
  },

  // ── React (JSX files) ──
  {
    files: ["**/*.{tsx,jsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // not needed with React 17+ JSX transform
      "react/prop-types": "off", // TypeScript handles prop validation
    },
  },

  // ── Project-wide defaults ──
  {
    rules: {
      // Default: allow `any` as WARN to avoid massive churn in graphics/motion code.
      // We enable a strict ban only in "app" layers below.
      "@typescript-eslint/no-explicit-any": "warn",

      // Unused vars are usually cosmetic; keep as warning.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // ── App layers: `any` is a smell → ERROR ──
  {
    files: [
      "src/i18n/**/*.{ts,tsx}",
      "src/pages/**/*.{ts,tsx,astro}",
      "src/components/pages/**/*.{ts,tsx,astro}",
      "src/components/widgets/**/*.{ts,tsx}",
      "src/components/ui/Header.{ts,tsx}",
      "src/components/ui/Header.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },

  // ── React hooks: treat dependency issues as errors (real bugs) ──
  {
    files: ["**/*.{tsx,jsx}"],
    rules: {
      "react-hooks/exhaustive-deps": "error",
    },
  },

  // ── Prettier (must be LAST to disable conflicting rules) ──
  eslintConfigPrettier,
);
