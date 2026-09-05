import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedObservedNailHeadDarkness: readonly number[];
  readonly callerObservedNailHeadDarknessLower: readonly number[];
  readonly callerObservedNailHeadDarknessUpper: readonly number[];
  readonly knownObservedNailHeadDarknessFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedNailHeadDarkness",
    label: "Observed observed nail head darkness",
    kind: "numberList",
  },
  {
    id: "callerObservedNailHeadDarknessLower",
    label: "Caller observed nail head darkness lower",
    kind: "numberList",
  },
  {
    id: "callerObservedNailHeadDarknessUpper",
    label: "Caller observed nail head darkness upper",
    kind: "numberList",
  },
  {
    id: "knownObservedNailHeadDarknessFlags",
    label: "Known observed nail head darkness flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedObservedNailHeadDarkness,
    input.callerObservedNailHeadDarknessLower,
    input.callerObservedNailHeadDarknessUpper,
    input.knownObservedNailHeadDarknessFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedNailHeadDarkness: [2, 5],
  callerObservedNailHeadDarknessLower: [1, 1],
  callerObservedNailHeadDarknessUpper: [3, 4],
  knownObservedNailHeadDarknessFlags: [1, 0],
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
  id: "gemology/nail-head-flag",
  title: "Nail-Head Proportion Flag Calculator",
  description:
    "Actual independently measured central darkness under matched illumination against caller nail-head screen; depth alone not diagnosis. Missing evidence retained as explicit indices, not confirmed zero margin. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      observedObservedNailHeadDarkness:
        value.observedObservedNailHeadDarkness as readonly number[],
      callerObservedNailHeadDarknessLower:
        value.callerObservedNailHeadDarknessLower as readonly number[],
      callerObservedNailHeadDarknessUpper:
        value.callerObservedNailHeadDarknessUpper as readonly number[],
      knownObservedNailHeadDarknessFlags:
        value.knownObservedNailHeadDarknessFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
