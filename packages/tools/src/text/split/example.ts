import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    delimiter: ",",
    text: "red,green,blue",
  },
  output: {
    parts: ["red", "green", "blue"],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
