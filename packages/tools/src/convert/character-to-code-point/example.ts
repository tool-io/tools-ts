import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    character: "A",
  },
  output: {
    codePoint: 65,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
