import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedGloss: readonly number[];
  readonly callerGlossLower: readonly number[];
  readonly callerGlossUpper: readonly number[];
  readonly knownGlossFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  { id: "observedGloss", label: "Observed gloss", kind: "numberList" },
  { id: "callerGlossLower", label: "Caller gloss lower", kind: "numberList" },
  { id: "callerGlossUpper", label: "Caller gloss upper", kind: "numberList" },
  { id: "knownGlossFlags", label: "Known gloss flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedGloss,
    input.callerGlossLower,
    input.callerGlossUpper,
    input.knownGlossFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGloss: [2, 5],
  callerGlossLower: [1, 1],
  callerGlossUpper: [3, 4],
  knownGlossFlags: [1, 0],
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
  id: "philately/regummed-gloss-flag-checker",
  title: "Regummed Detection Gloss Test Flag Checker",
  description:
    "Compare observed gloss against independent same-paper reference bands; no physical testing instructions or proof of regumming. Missing observations remain explicit. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedGloss: value.observedGloss as readonly number[],
      callerGlossLower: value.callerGlossLower as readonly number[],
      callerGlossUpper: value.callerGlossUpper as readonly number[],
      knownGlossFlags: value.knownGlossFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
