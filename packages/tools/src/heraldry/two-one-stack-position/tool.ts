import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, canvas } from "../batch43-shared.js";

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
  canvas(input.fieldWidth, input.fieldHeight);
  return {
    centers: [
      [input.fieldWidth / 3, input.fieldHeight / 3],
      [(2 * input.fieldWidth) / 3, input.fieldHeight / 3],
      [input.fieldWidth / 2, (2 * input.fieldHeight) / 3],
    ],
  };
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
        [33.333333333333336, 40],
        [66.66666666666667, 40],
        [50, 80],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/two-one-stack-position",
  title: "Two-and-One Charge Stack Position Calculator",
  description:
    "Construct an ideal two-and-one normalized rectangular-envelope layout, not shield-centroid placement or universal arrangement proportions.",
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
