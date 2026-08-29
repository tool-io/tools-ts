import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    text: "Hello world",
    search: "world",
    replacement: "tool.io",
  },
  output: {
    text: "Hello tool.io",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
