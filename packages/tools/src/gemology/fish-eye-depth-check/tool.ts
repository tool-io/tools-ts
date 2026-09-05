import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedObservedFishEyeAnnulus: readonly number[];
  readonly callerObservedFishEyeAnnulusLower: readonly number[];
  readonly callerObservedFishEyeAnnulusUpper: readonly number[];
  readonly knownObservedFishEyeAnnulusFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedFishEyeAnnulus",
    label: "Observed observed fish eye annulus",
    kind: "numberList",
  },
  {
    id: "callerObservedFishEyeAnnulusLower",
    label: "Caller observed fish eye annulus lower",
    kind: "numberList",
  },
  {
    id: "callerObservedFishEyeAnnulusUpper",
    label: "Caller observed fish eye annulus upper",
    kind: "numberList",
  },
  {
    id: "knownObservedFishEyeAnnulusFlags",
    label: "Known observed fish eye annulus flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedObservedFishEyeAnnulus,
    input.callerObservedFishEyeAnnulusLower,
    input.callerObservedFishEyeAnnulusUpper,
    input.knownObservedFishEyeAnnulusFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedFishEyeAnnulus: [2, 5],
  callerObservedFishEyeAnnulusLower: [1, 1],
  callerObservedFishEyeAnnulusUpper: [3, 4],
  knownObservedFishEyeAnnulusFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownMargins: [1, 0],
  knownReviewIndices: [],
  unknownIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/fish-eye-depth-check",
  title: "Fish-Eye Detection Depth Check",
  description:
    "Observed independently annotated annular girdle-reflection diameter/depth evidence under caller fish-eye review bands. Missing evidence retained as explicit indices, not confirmed zero margin. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownMargins",
      label: "Signed known margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
      kind: "numberList",
    },
    { id: "unknownIndices", label: "Unknown indices", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      observedObservedFishEyeAnnulus:
        value.observedObservedFishEyeAnnulus as readonly number[],
      callerObservedFishEyeAnnulusLower:
        value.callerObservedFishEyeAnnulusLower as readonly number[],
      callerObservedFishEyeAnnulusUpper:
        value.callerObservedFishEyeAnnulusUpper as readonly number[],
      knownObservedFishEyeAnnulusFlags:
        value.knownObservedFishEyeAnnulusFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
