import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedGutterIntegrity: readonly number[];
  readonly callerGutterIntegrityLower: readonly number[];
  readonly callerGutterIntegrityUpper: readonly number[];
  readonly knownGutterIntegrityFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGutterIntegrity",
    label: "Observed gutter integrity",
    kind: "numberList",
  },
  {
    id: "callerGutterIntegrityLower",
    label: "Caller gutter integrity lower",
    kind: "numberList",
  },
  {
    id: "callerGutterIntegrityUpper",
    label: "Caller gutter integrity upper",
    kind: "numberList",
  },
  {
    id: "knownGutterIntegrityFlags",
    label: "Known gutter integrity flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedGutterIntegrity,
    input.callerGutterIntegrityLower,
    input.callerGutterIntegrityUpper,
    input.knownGutterIntegrityFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGutterIntegrity: [2, 5],
  callerGutterIntegrityLower: [1, 1],
  callerGutterIntegrityUpper: [3, 4],
  knownGutterIntegrityFlags: [1, 0],
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
  id: "philately/gutter-pair-integrity-checker",
  title: "Gutter Pair Separator Integrity Checker",
  description:
    "Audit observed gutter separator measurements against caller same-issue limits. Missing observations remain explicit. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedGutterIntegrity:
        value.observedGutterIntegrity as readonly number[],
      callerGutterIntegrityLower:
        value.callerGutterIntegrityLower as readonly number[],
      callerGutterIntegrityUpper:
        value.callerGutterIntegrityUpper as readonly number[],
      knownGutterIntegrityFlags:
        value.knownGutterIntegrityFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
