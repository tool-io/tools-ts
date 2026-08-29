import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    emptyEntryPolicy: "reject",
    value: "1, 2, 3",
  },
  output: {
    normalized: "1,2,3",
    values: [1, 2, 3],
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
