import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredActiveSpinMagnitude: number;
  readonly independentlyMeasuredTotalSpinMagnitude: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredActiveSpinMagnitude",
    label: "Independently measured active spin magnitude",
    kind: "number",
  },
  {
    id: "independentlyMeasuredTotalSpinMagnitude",
    label: "Independently measured total spin magnitude",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredActiveSpinMagnitude, "numerator");
  positive(input.independentlyMeasuredTotalSpinMagnitude, "denominator");
  return {
    observedRatio:
      (100 * input.independentlyMeasuredActiveSpinMagnitude) /
      input.independentlyMeasuredTotalSpinMagnitude,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredActiveSpinMagnitude: 2,
    independentlyMeasuredTotalSpinMagnitude: 4,
  },
  output: { result: { observedRatio: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/breaking-pitch-spin-efficiency-active-spin-percentage",
  title: "Breaking Pitch Spin Efficiency Active Spin Percentage",
  description:
    "Active-spin component fraction on actual same-protocol spin magnitudes, not infer lift direction, ball trajectory or performance. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
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
