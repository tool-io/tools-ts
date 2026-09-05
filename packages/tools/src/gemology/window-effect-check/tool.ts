import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedCentralWindowTransmission: readonly number[];
  readonly callerCentralWindowTransmissionLower: readonly number[];
  readonly callerCentralWindowTransmissionUpper: readonly number[];
  readonly knownCentralWindowTransmissionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCentralWindowTransmission",
    label: "Observed central window transmission",
    kind: "numberList",
  },
  {
    id: "callerCentralWindowTransmissionLower",
    label: "Caller central window transmission lower",
    kind: "numberList",
  },
  {
    id: "callerCentralWindowTransmissionUpper",
    label: "Caller central window transmission upper",
    kind: "numberList",
  },
  {
    id: "knownCentralWindowTransmissionFlags",
    label: "Known central window transmission flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedCentralWindowTransmission,
    input.callerCentralWindowTransmissionLower,
    input.callerCentralWindowTransmissionUpper,
    input.knownCentralWindowTransmissionFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCentralWindowTransmission: [2, 5],
  callerCentralWindowTransmissionLower: [1, 1],
  callerCentralWindowTransmissionUpper: [3, 4],
  knownCentralWindowTransmissionFlags: [1, 0],
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
  id: "gemology/window-effect-check",
  title: "Window Effect Depth Check for Cabs",
  description:
    "Measured normalized central transmitted-light patch under caller geometry/protocol windowing criteria, not critical-angle-only predicted appearance. Missing evidence retained as explicit indices, not confirmed zero margin. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      observedCentralWindowTransmission:
        value.observedCentralWindowTransmission as readonly number[],
      callerCentralWindowTransmissionLower:
        value.callerCentralWindowTransmissionLower as readonly number[],
      callerCentralWindowTransmissionUpper:
        value.callerCentralWindowTransmissionUpper as readonly number[],
      knownCentralWindowTransmissionFlags:
        value.knownCentralWindowTransmissionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
