import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, stripedGrid } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldWidth: number;
  readonly fieldHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fieldWidth", label: "Field width", kind: "number" },
  { id: "fieldHeight", label: "Field height", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return stripedGrid(input.fieldWidth, input.fieldHeight, 2, 2);
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fieldWidth: 100, fieldHeight: 120 },
  output: {
    result: {
      centers: [
        [25, 30],
        [75, 30],
        [25, 90],
        [75, 90],
      ],
      cellWidth: 50,
      cellHeight: 60,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/four-quarter-layout-generator",
  title: "Four-Quarter Charge Layout Positions Generator",
  description:
    "Four quarter-center positions in a rectangular envelope, viewer row-major order1\u20134.",
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
