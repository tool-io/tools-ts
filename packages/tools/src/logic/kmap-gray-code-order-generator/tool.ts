import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly rowBits: number;
  readonly columnBits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rowBits", label: "Row bits", kind: "number" },
  { id: "columnBits", label: "Column bits", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.rowBits, "row bits", 0, 4);
  bounded(i.columnBits, "column bits", 0, 4);
  const labels = (n: number) =>
    Array.from({ length: 2 ** n }, (_, j) =>
      n ? (j ^ (j >> 1)).toString(2).padStart(n, "0") : "",
    );
  return { rowLabels: labels(i.rowBits), columnLabels: labels(i.columnBits) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { rowBits: 2, columnBits: 1 },
  output: {
    result: { rowLabels: ["00", "01", "11", "10"], columnLabels: ["0", "1"] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/kmap-gray-code-order-generator",
  title: "Karnaugh Gray Code Row Column Order Generator",
  description:
    "Binary-reflected Gray-code row/column order for a caller K-map dimension up to four bits per axis; does not minimize expressions.",
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
