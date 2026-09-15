import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch52-shared.js";
export type Input = Readonly<{ readonly cells: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cells", label: "Cells", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    normalizedCells: i.cells.map((s) =>
      ["", "N/A", "NULL", "-"].includes(s.trim().toUpperCase()) ? null : s,
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { cells: ["N/A", " null ", "-", " x ", ""] },
  output: { result: { normalizedCells: [null, null, null, " x ", null] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "csv/null-token-normalizer-empty-na-null-dash",
  title: "Null Token Normalizer (N/A, NULL, -)",
  description:
    "Explicit case-insensitive trimmed null-token policy N/A,NULL,-,empty; preserves other cells byte-for-byte, may erase literal tokens by policy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
