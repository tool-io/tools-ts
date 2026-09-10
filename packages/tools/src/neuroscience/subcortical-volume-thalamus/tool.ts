import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlySegmentedLeftThalamusMl: number;
  readonly independentlySegmentedRightThalamusMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlySegmentedLeftThalamusMl",
    label: "Independently segmented left thalamus ml",
    kind: "number",
  },
  {
    id: "independentlySegmentedRightThalamusMl",
    label: "Independently segmented right thalamus ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlySegmentedLeftThalamusMl, "volume");
  nonnegative(input.independentlySegmentedRightThalamusMl, "volume");
  return {
    observedBilateralThalamicVolumeMl:
      input.independentlySegmentedLeftThalamusMl +
      input.independentlySegmentedRightThalamusMl,
    signedRightMinusLeftThalamicVolumeMl:
      input.independentlySegmentedRightThalamusMl -
      input.independentlySegmentedLeftThalamusMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlySegmentedLeftThalamusMl: 5,
    independentlySegmentedRightThalamusMl: 6,
  },
  output: {
    result: {
      observedBilateralThalamicVolumeMl: 11,
      signedRightMinusLeftThalamicVolumeMl: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/subcortical-volume-thalamus",
  title: "Thalamic Subcortical Volume Calculator",
  description:
    "Actual bilateral thalamus segmentation volume sum and signed side discrepancy; anatomical definitions and segmentation external, not age-normalized abnormality.",
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
