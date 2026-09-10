import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBaselineBloodVolumeMl: number;
  readonly callerIndependentlyCalibratedPregnancyExpansionFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedBaselineBloodVolumeMl",
    label: "Caller verified baseline blood volume ml",
    kind: "number",
  },
  {
    id: "callerIndependentlyCalibratedPregnancyExpansionFraction",
    label: "Caller independently calibrated pregnancy expansion fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerVerifiedBaselineBloodVolumeMl, "baseline");
  fraction(
    input.callerIndependentlyCalibratedPregnancyExpansionFraction,
    "expansion",
  );
  return {
    conditionalBloodVolumeIncreaseMl:
      input.callerVerifiedBaselineBloodVolumeMl *
      input.callerIndependentlyCalibratedPregnancyExpansionFraction,
    conditionalTotalBloodVolumeMl:
      input.callerVerifiedBaselineBloodVolumeMl *
      (1 + input.callerIndependentlyCalibratedPregnancyExpansionFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedBaselineBloodVolumeMl: 4000,
    callerIndependentlyCalibratedPregnancyExpansionFraction: 0.4,
  },
  output: {
    result: {
      conditionalBloodVolumeIncreaseMl: 1600,
      conditionalTotalBloodVolumeMl: 5600,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/maternal-blood-volume-increase",
  title: "Maternal Blood Volume Increase Calculator",
  description:
    "Conditional reference-based blood-volume scenario with independently calibrated baseline/expansion. Not measured maternal blood volume, universal pregnancy change or transfusion/haemorrhage assessment.",
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
