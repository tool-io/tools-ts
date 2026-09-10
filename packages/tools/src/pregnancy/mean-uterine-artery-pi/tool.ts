import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredLeftUterinePi: number;
  readonly independentlyMeasuredRightUterinePi: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredLeftUterinePi",
    label: "Independently measured left uterine pi",
    kind: "number",
  },
  {
    id: "independentlyMeasuredRightUterinePi",
    label: "Independently measured right uterine pi",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredLeftUterinePi, "PI");
  nonnegative(input.independentlyMeasuredRightUterinePi, "PI");
  return {
    observedBilateralMeanUterinePi:
      (input.independentlyMeasuredLeftUterinePi +
        input.independentlyMeasuredRightUterinePi) /
      2,
    signedRightMinusLeftPi:
      input.independentlyMeasuredRightUterinePi -
      input.independentlyMeasuredLeftUterinePi,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredLeftUterinePi: 1,
    independentlyMeasuredRightUterinePi: 2,
  },
  output: {
    result: { observedBilateralMeanUterinePi: 1.5, signedRightMinusLeftPi: 1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/mean-uterine-artery-pi",
  title: "Mean Uterine Artery PI Calculator",
  description:
    "Actual bilateral uterine-artery PIarithmetic mean with signed side discrepancy, not flow-weighted pooling, screening probability or universal threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
