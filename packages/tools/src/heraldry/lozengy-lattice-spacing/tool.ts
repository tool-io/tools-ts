import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly horizontalDiamondDiagonal: number;
  readonly verticalDiamondDiagonal: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "horizontalDiamondDiagonal",
    label: "Horizontal diamond diagonal",
    kind: "number",
  },
  {
    id: "verticalDiamondDiagonal",
    label: "Vertical diamond diagonal",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.horizontalDiamondDiagonal, "horizontalDiamondDiagonal");
  positive(input.verticalDiamondDiagonal, "verticalDiamondDiagonal");
  return {
    horizontalHalfSpacing: input.horizontalDiamondDiagonal / 2,
    verticalHalfSpacing: input.verticalDiamondDiagonal / 2,
    diamondCellArea:
      (input.horizontalDiamondDiagonal * input.verticalDiamondDiagonal) / 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { horizontalDiamondDiagonal: 20, verticalDiamondDiagonal: 30 },
  output: {
    result: {
      horizontalHalfSpacing: 10,
      verticalHalfSpacing: 15,
      diamondCellArea: 300,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/lozengy-lattice-spacing",
  title: "Lozengy Diamond Lattice Spacing Calculator",
  description:
    "Measured lozengy cell spacing and area under ideal rhombus diagonals, no field-cover count from perimeter alone.",
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
