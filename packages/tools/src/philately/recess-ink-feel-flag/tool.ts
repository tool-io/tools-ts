import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedInkRidge: readonly number[];
  readonly callerInkRidgeLower: readonly number[];
  readonly callerInkRidgeUpper: readonly number[];
  readonly knownInkRidgeFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  { id: "observedInkRidge", label: "Observed ink ridge", kind: "numberList" },
  {
    id: "callerInkRidgeLower",
    label: "Caller ink ridge lower",
    kind: "numberList",
  },
  {
    id: "callerInkRidgeUpper",
    label: "Caller ink ridge upper",
    kind: "numberList",
  },
  {
    id: "knownInkRidgeFlags",
    label: "Known ink ridge flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedInkRidge,
    input.callerInkRidgeLower,
    input.callerInkRidgeUpper,
    input.knownInkRidgeFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInkRidge: [2, 5],
  callerInkRidgeLower: [1, 1],
  callerInkRidgeUpper: [3, 4],
  knownInkRidgeFlags: [1, 0],
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
  id: "philately/recess-ink-feel-flag",
  title: "Recess Printing Ink Feel Ridge Test Flag",
  description:
    "Audit independently observed ink ridge measurements, not recommended touching or an authentication proof. Missing observations remain explicit. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedInkRidge: value.observedInkRidge as readonly number[],
      callerInkRidgeLower: value.callerInkRidgeLower as readonly number[],
      callerInkRidgeUpper: value.callerInkRidgeUpper as readonly number[],
      knownInkRidgeFlags: value.knownInkRidgeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
