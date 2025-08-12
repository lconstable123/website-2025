import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginTs from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Load Next.js + TypeScript recommended rules
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

// Add your override to disable no-unused-vars
const overrideConfig = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": eslintPluginTs,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // 👈 Disable here
    },
  },
];

// Merge both
export default [...eslintConfig, ...overrideConfig];
