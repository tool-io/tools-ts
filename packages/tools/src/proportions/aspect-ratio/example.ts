import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    height: 1080,
    width: 1920,
  },
  output: {
    ratio: 1.7777777777777777,
    reducedWidth: 16,
    reducedHeight: 9,
    formatted: "16:9",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
