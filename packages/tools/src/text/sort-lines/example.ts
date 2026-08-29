import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    descending: false,
    text: "pear\napple\nbanana",
  },
  output: {
    text: "apple\nbanana\npear",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
