import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  nonnegative,
  sum,
  unique,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyClassifiedWmhLesionIds: readonly string[];
  readonly independentlySegmentedLesionVolumesMl: readonly number[];
  readonly lesionEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyClassifiedWmhLesionIds",
    label: "Caller independently classified wmh lesion ids",
    kind: "stringList",
  },
  {
    id: "independentlySegmentedLesionVolumesMl",
    label: "Independently segmented lesion volumes ml",
    kind: "numberList",
  },
  {
    id: "lesionEvidenceKnownFlags",
    label: "Lesion evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerIndependentlyClassifiedWmhLesionIds, "lesions");
  aligned(
    input.callerIndependentlyClassifiedWmhLesionIds,
    input.independentlySegmentedLesionVolumesMl,
    "volumes",
  );
  aligned(
    input.callerIndependentlyClassifiedWmhLesionIds,
    input.lesionEvidenceKnownFlags,
    "known",
  );
  binary(input.lesionEvidenceKnownFlags, "known");
  input.independentlySegmentedLesionVolumesMl.forEach((v) =>
    nonnegative(v, "volume"),
  );
  return {
    observedKnownWmhVolumeMl: sum(
      input.independentlySegmentedLesionVolumesMl.map(
        (v, i) => v * input.lesionEvidenceKnownFlags[i],
      ),
    ),
    knownWmhLesionIds: input.callerIndependentlyClassifiedWmhLesionIds.filter(
      (_, i) => input.lesionEvidenceKnownFlags[i],
    ),
    unknownWmhLesionIds: input.callerIndependentlyClassifiedWmhLesionIds.filter(
      (_, i) => !input.lesionEvidenceKnownFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyClassifiedWmhLesionIds: ["a", "b", "c"],
    independentlySegmentedLesionVolumesMl: [1, 2, 3],
    lesionEvidenceKnownFlags: [1, 1, 0],
  },
  output: {
    result: {
      observedKnownWmhVolumeMl: 3,
      knownWmhLesionIds: ["a", "b"],
      unknownWmhLesionIds: ["c"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/white-matter-hyperintensity-volume",
  title: "White Matter Hyperintensity Volume Calculator",
  description:
    "Actual independently classified nonoverlapping WMHlesion-volume ledger with unknown lesion evidence retained, not generic raw-voxel lesion volume, automatic image segmentation or infer vascular etiology.",
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
