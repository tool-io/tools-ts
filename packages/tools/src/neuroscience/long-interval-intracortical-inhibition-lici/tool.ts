import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMatchedConditionedMepAmplitudesMv: readonly number[];
  readonly independentlyMatchedUnconditionedMepAmplitudesMv: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMatchedConditionedMepAmplitudesMv",
    label: "Independently matched conditioned mep amplitudes mv",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedUnconditionedMepAmplitudesMv",
    label: "Independently matched unconditioned mep amplitudes mv",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMatchedConditionedMepAmplitudesMv,
    input.independentlyMatchedUnconditionedMepAmplitudesMv,
    "trials",
  );
  [
    input.independentlyMatchedConditionedMepAmplitudesMv,
    input.independentlyMatchedUnconditionedMepAmplitudesMv,
  ].forEach((v) => v.forEach((x) => nonnegative(x, "amplitude")));
  const r =
    (100 * sum(input.independentlyMatchedConditionedMepAmplitudesMv)) /
    positive(
      sum(input.independentlyMatchedUnconditionedMepAmplitudesMv),
      "reference",
    );
  return {
    observedPooledConditionedPercentOfUnconditioned: r,
    signedSuppressionPercent: 100 - r,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMatchedConditionedMepAmplitudesMv: [1, 2],
    independentlyMatchedUnconditionedMepAmplitudesMv: [2, 4],
  },
  output: {
    result: {
      observedPooledConditionedPercentOfUnconditioned: 50,
      signedSuppressionPercent: 50,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/long-interval-intracortical-inhibition-lici",
  title: "LICI Calculator",
  description:
    "Actual LICIlong-interval protocol-matched MEPpooled-amplitude ratio and signed100\u2212ratio suppression. Pulse intervals, intensities, trial quality and biological interpretation external; ratios>100retain negative suppression, not clinical diagnosis or stimulation instructions.",
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
