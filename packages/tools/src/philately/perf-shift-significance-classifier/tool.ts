import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedPerfShiftMm: readonly number[];
  readonly callerPerfShiftMmLower: readonly number[];
  readonly callerPerfShiftMmUpper: readonly number[];
  readonly knownPerfShiftMmFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPerfShiftMm",
    label: "Observed perf shift mm",
    kind: "numberList",
  },
  {
    id: "callerPerfShiftMmLower",
    label: "Caller perf shift mm lower",
    kind: "numberList",
  },
  {
    id: "callerPerfShiftMmUpper",
    label: "Caller perf shift mm upper",
    kind: "numberList",
  },
  {
    id: "knownPerfShiftMmFlags",
    label: "Known perf shift mm flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedPerfShiftMm,
    input.callerPerfShiftMmLower,
    input.callerPerfShiftMmUpper,
    input.knownPerfShiftMmFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPerfShiftMm: [2, 5],
  callerPerfShiftMmLower: [1, 1],
  callerPerfShiftMmUpper: [3, 4],
  knownPerfShiftMmFlags: [1, 0],
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
  id: "philately/perf-shift-significance-classifier",
  title: "Perforation Variety Shift mm Significance Classifier",
  description:
    "Compare measured perforation shift with caller issue-specific significance bands. Missing observations remain explicit. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedPerfShiftMm: value.observedPerfShiftMm as readonly number[],
      callerPerfShiftMmLower: value.callerPerfShiftMmLower as readonly number[],
      callerPerfShiftMmUpper: value.callerPerfShiftMmUpper as readonly number[],
      knownPerfShiftMmFlags: value.knownPerfShiftMmFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
