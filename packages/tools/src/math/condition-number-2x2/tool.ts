import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, svd2 } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMatrix: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualMatrix", label: "Actual matrix", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const s = svd2(input.actualMatrix);
  positive(s[1], "smallestsingularvalue");
  return { spectralConditionNumber: s[0] / s[1] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMatrix: [
      [2, 0],
      [0, 1],
    ],
  },
  output: { result: { spectralConditionNumber: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/condition-number-2x2",
  title: "2x2 Condition Number Calculator",
  description:
    "Actual2\u00d72spectral2norm condition number\u03c3max/\u03c3min, zero/singular cases rejected rather than fabricate finite value; scaled stable singular values, not1norm/\u221enorm.",
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
