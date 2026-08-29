import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    text: "Hello world",
    prefix: "> ",
  },
  output: {
    text: "> Hello world",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
