import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, stripedGrid } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldWidth: number;
  readonly fieldHeight: number;
  readonly rows: number;
  readonly columns: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fieldWidth", label: "Field width", kind: "number" },
  { id: "fieldHeight", label: "Field height", kind: "number" },
  { id: "rows", label: "Rows", kind: "number" },
  { id: "columns", label: "Columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return stripedGrid(
    input.fieldWidth,
    input.fieldHeight,
    input.rows,
    input.columns,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fieldWidth: 100, fieldHeight: 100, rows: 2, columns: 2 },
  output: {
    result: {
      centers: [
        [25, 25],
        [75, 25],
        [25, 75],
        [75, 75],
      ],
      cellWidth: 50,
      cellHeight: 50,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/chequy-grid-dimension-solver",
  title: "Chequy Square Grid Dimension Solver",
  description:
    "Ideal chequy rectangular-envelope cell centers; caller shield clipping and partial cells not inferred.",
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
