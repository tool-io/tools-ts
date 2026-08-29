import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    text: "apple\nbanana\napple",
  },
  output: {
    text: "apple\nbanana",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
