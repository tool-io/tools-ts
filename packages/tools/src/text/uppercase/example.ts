import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    text: "Hello world",
    locale: "en-US",
  },
  output: {
    text: "HELLO WORLD",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
