import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  shape,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMatrix: readonly (readonly number[])[];
  readonly actualRowIndex: number;
  readonly actualColumnIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualMatrix", label: "Actual matrix", kind: "matrix" },
  { id: "actualRowIndex", label: "Actual row index", kind: "number" },
  { id: "actualColumnIndex", label: "Actual column index", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    shape(input.actualMatrix, "matrix") !== 2 ||
    input.actualMatrix.length !== 2
  )
    simpleError("matrix", "2×2matrix.");
  bounded(input.actualRowIndex, "row", 0, 1);
  bounded(input.actualColumnIndex, "column", 0, 1);
  return {
    value:
      input.actualMatrix[1 - input.actualRowIndex][1 - input.actualColumnIndex],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMatrix: [
      [1, 2],
      [3, 4],
    ],
    actualRowIndex: 0,
    actualColumnIndex: 1,
  },
  output: { result: { value: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/minor-2x2",
  title: "2x2 Minor Calculator",
  description:
    "Actual2\u00d72unsigneddeletedrow/columnminor,zero-basedindices0/1,finitebinary64.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
