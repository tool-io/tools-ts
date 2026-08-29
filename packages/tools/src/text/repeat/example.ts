import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    text: "Hello world",
    count: 3,
  },
  output: {
    text: "Hello worldHello worldHello world",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
