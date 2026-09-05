import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedMeasuredAngleExtinction: readonly number[];
  readonly callerMeasuredAngleExtinctionLower: readonly number[];
  readonly callerMeasuredAngleExtinctionUpper: readonly number[];
  readonly knownMeasuredAngleExtinctionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMeasuredAngleExtinction",
    label: "Observed measured angle extinction",
    kind: "numberList",
  },
  {
    id: "callerMeasuredAngleExtinctionLower",
    label: "Caller measured angle extinction lower",
    kind: "numberList",
  },
  {
    id: "callerMeasuredAngleExtinctionUpper",
    label: "Caller measured angle extinction upper",
    kind: "numberList",
  },
  {
    id: "knownMeasuredAngleExtinctionFlags",
    label: "Known measured angle extinction flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedMeasuredAngleExtinction,
    input.callerMeasuredAngleExtinctionLower,
    input.callerMeasuredAngleExtinctionUpper,
    input.knownMeasuredAngleExtinctionFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMeasuredAngleExtinction: [2, 5],
  callerMeasuredAngleExtinctionLower: [1, 1],
  callerMeasuredAngleExtinctionUpper: [3, 4],
  knownMeasuredAngleExtinctionFlags: [1, 0],
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
  id: "gemology/extinction-risk-angle",
  title: "Extinction Risk Angle Checker",
  description:
    "Actual paired measured cut tilt angle and observed dark-area fraction against caller matched-protocol criteria; no extinction prediction from angle alone. Missing evidence retained as explicit indices, not confirmed zero margin. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      observedMeasuredAngleExtinction:
        value.observedMeasuredAngleExtinction as readonly number[],
      callerMeasuredAngleExtinctionLower:
        value.callerMeasuredAngleExtinctionLower as readonly number[],
      callerMeasuredAngleExtinctionUpper:
        value.callerMeasuredAngleExtinctionUpper as readonly number[],
      knownMeasuredAngleExtinctionFlags:
        value.knownMeasuredAngleExtinctionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
