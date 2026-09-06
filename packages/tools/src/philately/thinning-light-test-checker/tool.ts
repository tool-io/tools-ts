import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedTransmission: readonly number[];
  readonly callerTransmissionLower: readonly number[];
  readonly callerTransmissionUpper: readonly number[];
  readonly knownTransmissionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTransmission",
    label: "Observed transmission",
    kind: "numberList",
  },
  {
    id: "callerTransmissionLower",
    label: "Caller transmission lower",
    kind: "numberList",
  },
  {
    id: "callerTransmissionUpper",
    label: "Caller transmission upper",
    kind: "numberList",
  },
  {
    id: "knownTransmissionFlags",
    label: "Known transmission flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedTransmission,
    input.callerTransmissionLower,
    input.callerTransmissionUpper,
    input.knownTransmissionFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTransmission: [2, 5],
  callerTransmissionLower: [1, 1],
  callerTransmissionUpper: [3, 4],
  knownTransmissionFlags: [1, 0],
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
  id: "philately/thinning-light-test-checker",
  title: "Thinning Light Test Pass-Fail Checker",
  description:
    "Compare independently measured transmitted-light observations with matched caller reference bands; not a destructive test. Missing observations remain explicit. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedTransmission: value.observedTransmission as readonly number[],
      callerTransmissionLower:
        value.callerTransmissionLower as readonly number[],
      callerTransmissionUpper:
        value.callerTransmissionUpper as readonly number[],
      knownTransmissionFlags: value.knownTransmissionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
