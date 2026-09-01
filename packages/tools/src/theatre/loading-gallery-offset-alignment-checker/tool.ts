import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedArborLoadingPositionsM: readonly number[];
  readonly galleryLoadingBayCentersM: readonly number[];
  readonly callerAlignmentToleranceM: number;
}>;
export type Output = Readonly<{
  readonly signedGalleryMinusArborOffsetsM: readonly number[];
  readonly outsideCallerAlignmentToleranceIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedArborLoadingPositionsM",
    label: "Observed arbor loading positions m",
    kind: "numberList",
  },
  {
    id: "galleryLoadingBayCentersM",
    label: "Gallery loading bay centers m",
    kind: "numberList",
  },
  {
    id: "callerAlignmentToleranceM",
    label: "Caller alignment tolerance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerAlignmentToleranceM, "callerAlignmentToleranceM");
  aligned(
    input.observedArborLoadingPositionsM,
    input.galleryLoadingBayCentersM,
    "observedArborLoadingPositionsM",
  );
  const d = input.galleryLoadingBayCentersM.map(
    (v, i) => v - input.observedArborLoadingPositionsM[i],
  );
  return {
    signedGalleryMinusArborOffsetsM: d,
    outsideCallerAlignmentToleranceIndices: d.flatMap((v, i) =>
      Math.abs(v) > input.callerAlignmentToleranceM ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedArborLoadingPositionsM: [1, 2],
  galleryLoadingBayCentersM: [1.1, 2],
  callerAlignmentToleranceM: 0.05,
} satisfies Input;
export const exampleOutput = {
  signedGalleryMinusArborOffsetsM: [0.1, 0],
  outsideCallerAlignmentToleranceIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/loading-gallery-offset-alignment-checker",
  title: "Loading Gallery Offset Alignment Checker",
  description:
    "Audit independently observed loading-bay/arbor alignment in caller same physical axis; no approval to load counterweights or assess structural/platform safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedGalleryMinusArborOffsetsM",
      label: "Signed gallery minus arbor offsets m",
      kind: "numberList",
    },
    {
      id: "outsideCallerAlignmentToleranceIndices",
      label: "Outside caller alignment tolerance indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedArborLoadingPositionsM:
        value.observedArborLoadingPositionsM as readonly number[],
      galleryLoadingBayCentersM:
        value.galleryLoadingBayCentersM as readonly number[],
      callerAlignmentToleranceM: value.callerAlignmentToleranceM as number,
    }),
});
export const run = tool.execute;
export default tool;
