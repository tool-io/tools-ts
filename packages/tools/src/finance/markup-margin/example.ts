import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    mode: "markup-to-margin",
    percent: 25,
  },
  output: {
    percent: 20,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
