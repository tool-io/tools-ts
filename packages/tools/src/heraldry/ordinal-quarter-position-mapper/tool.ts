import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly ordinal: number;
  readonly columns: number;
  readonly totalQuarters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ordinal", label: "Ordinal", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
  { id: "totalQuarters", label: "Total quarters", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.totalQuarters, "quarters", 1, 128);
  bounded(input.ordinal, "ordinal", 1, input.totalQuarters);
  bounded(input.columns, "columns", 1, 64);
  return {
    viewerRowIndex: Math.floor((input.ordinal - 1) / input.columns),
    viewerColumnIndex: (input.ordinal - 1) % input.columns,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { ordinal: 3, columns: 2, totalQuarters: 4 },
  output: { result: { viewerRowIndex: 1, viewerColumnIndex: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/ordinal-quarter-position-mapper",
  title: "Ordinal Number to Quarter Position Mapper",
  description:
    "Map one-based quarter ordinal to viewer row-major zero-based coordinates under explicit column count.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
