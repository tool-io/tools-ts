import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    code: 65,
  },
  output: {
    character: "A",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
