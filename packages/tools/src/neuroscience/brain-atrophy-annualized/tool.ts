import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredBaselineBrainVolumeMl: number;
  readonly independentlyMeasuredFollowupBrainVolumeMl: number;
  readonly independentlyMeasuredElapsedYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredBaselineBrainVolumeMl",
    label: "Independently measured baseline brain volume ml",
    kind: "number",
  },
  {
    id: "independentlyMeasuredFollowupBrainVolumeMl",
    label: "Independently measured followup brain volume ml",
    kind: "number",
  },
  {
    id: "independentlyMeasuredElapsedYears",
    label: "Independently measured elapsed years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredBaselineBrainVolumeMl, "baseline");
  nonnegative(input.independentlyMeasuredFollowupBrainVolumeMl, "followup");
  positive(input.independentlyMeasuredElapsedYears, "years");
  return {
    signedBaselineRelativeLossPercentPerYear:
      (100 *
        (1 -
          input.independentlyMeasuredFollowupBrainVolumeMl /
            input.independentlyMeasuredBaselineBrainVolumeMl)) /
      input.independentlyMeasuredElapsedYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredBaselineBrainVolumeMl: 1000,
    independentlyMeasuredFollowupBrainVolumeMl: 900,
    independentlyMeasuredElapsedYears: 2,
  },
  output: { result: { signedBaselineRelativeLossPercentPerYear: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/brain-atrophy-annualized",
  title: "Annualized Brain Atrophy Calculator",
  description:
    "Explicit linear annualized baseline-relative brain-volume loss, not compound geometric shrinkage, SIENA/BBSIimage processing or dementia diagnosis. Negative loss retains measured growth; protocol and scan uncertainty independently reviewed.",
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
