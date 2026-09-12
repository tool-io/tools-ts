import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  bounded,
  sum,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyQualifiedDisjointT2LesionVoxelCounts: readonly number[];
  readonly actualVoxelVolumeCubicMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyQualifiedDisjointT2LesionVoxelCounts",
    label: "Actual independently qualified disjoint t2 lesion voxel counts",
    kind: "numberList",
  },
  {
    id: "actualVoxelVolumeCubicMm",
    label: "Actual voxel volume cubic mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyQualifiedDisjointT2LesionVoxelCounts.length)
    simpleError(
      "actualIndependentlyQualifiedDisjointT2LesionVoxelCounts",
      "Actual nonempty observations.",
    );
  input.actualIndependentlyQualifiedDisjointT2LesionVoxelCounts.forEach((v) =>
    nonnegative(v, "actualIndependentlyQualifiedDisjointT2LesionVoxelCounts"),
  );
  positive(input.actualVoxelVolumeCubicMm, "actualVoxelVolumeCubicMm");
  input.actualIndependentlyQualifiedDisjointT2LesionVoxelCounts.forEach((v) =>
    bounded(v, "voxels", 0, 1000000),
  );
  return {
    value:
      sum(input.actualIndependentlyQualifiedDisjointT2LesionVoxelCounts) *
      input.actualVoxelVolumeCubicMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyQualifiedDisjointT2LesionVoxelCounts: [1, 2],
    actualVoxelVolumeCubicMm: 2,
  },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/lesion-load-t2",
  title: "T2 Lesion Load Calculator",
  description:
    "Actual separately qualified disjointT2lesion label voxel counts\u00d7physical voxel volume lesionloadmm\u00b3, not automatic segmentation or disease interpretation. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
