import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlySegmentedGrayMatterVolumeMl: number;
  readonly independentlySegmentedWhiteMatterVolumeMl: number;
  readonly independentlySegmentedCsfVolumeMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlySegmentedGrayMatterVolumeMl",
    label: "Independently segmented gray matter volume ml",
    kind: "number",
  },
  {
    id: "independentlySegmentedWhiteMatterVolumeMl",
    label: "Independently segmented white matter volume ml",
    kind: "number",
  },
  {
    id: "independentlySegmentedCsfVolumeMl",
    label: "Independently segmented csf volume ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.independentlySegmentedGrayMatterVolumeMl,
    input.independentlySegmentedWhiteMatterVolumeMl,
    input.independentlySegmentedCsfVolumeMl,
  ].forEach((v) => nonnegative(v, "volume"));
  return {
    observedPartitionedIntracranialVolumeMl:
      input.independentlySegmentedGrayMatterVolumeMl +
      input.independentlySegmentedWhiteMatterVolumeMl +
      input.independentlySegmentedCsfVolumeMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlySegmentedGrayMatterVolumeMl: 500,
    independentlySegmentedWhiteMatterVolumeMl: 400,
    independentlySegmentedCsfVolumeMl: 100,
  },
  output: { result: { observedPartitionedIntracranialVolumeMl: 1000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/brain-volume-intracranial",
  title: "Intracranial Brain Volume Calculator",
  description:
    "Actual disjoint complete GM/WM/CSF segmentation partition sum in mL. Segmentation, mask inclusion and compatibility external; not identify anatomy or infer disease or true intracranial volume from incomplete masks.",
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
