import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedVoxelIntensities: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedVoxelIntensities",
    label: "Actual qualified voxel intensities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualQualifiedVoxelIntensities.length)
    simpleError(
      "actualQualifiedVoxelIntensities",
      "Actual nonempty observations.",
    );
  return { value: Math.max(...input.actualQualifiedVoxelIntensities) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualQualifiedVoxelIntensities: [1, 5, 3] },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/peak-voxel-intensity",
  title: "Peak Voxel Intensity Calculator",
  description:
    "Peak actual independently mask qualified voxel intensity, no smoothing/segmentation, voxel coordinate or inferential peak-pvalue. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
