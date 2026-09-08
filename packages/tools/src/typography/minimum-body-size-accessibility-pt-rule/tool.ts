import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedMeasuredBodyPointSize: readonly number[];
  readonly callerMeasuredBodyPointSizeLower: readonly number[];
  readonly callerMeasuredBodyPointSizeUpper: readonly number[];
  readonly knownMeasuredBodyPointSizeFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMeasuredBodyPointSize",
    label: "Observed measured body point size",
    kind: "numberList",
  },
  {
    id: "callerMeasuredBodyPointSizeLower",
    label: "Caller measured body point size lower",
    kind: "numberList",
  },
  {
    id: "callerMeasuredBodyPointSizeUpper",
    label: "Caller measured body point size upper",
    kind: "numberList",
  },
  {
    id: "knownMeasuredBodyPointSizeFlags",
    label: "Known measured body point size flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedMeasuredBodyPointSize,
    input.callerMeasuredBodyPointSizeLower,
    input.callerMeasuredBodyPointSizeUpper,
    input.knownMeasuredBodyPointSizeFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMeasuredBodyPointSize: [2, 5],
  callerMeasuredBodyPointSizeLower: [1, 1],
  callerMeasuredBodyPointSizeUpper: [3, 4],
  knownMeasuredBodyPointSizeFlags: [1, 0],
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
  id: "typography/minimum-body-size-accessibility-pt-rule",
  title: "Minimum Body Size Accessibility pt Rule",
  description:
    "Measured body type font size against independently verified caller accessibility/publishing band, no standard universal minimum font size in points. Missing evidence retained as explicit indices, not confirmed zero margin. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
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
      observedMeasuredBodyPointSize:
        value.observedMeasuredBodyPointSize as readonly number[],
      callerMeasuredBodyPointSizeLower:
        value.callerMeasuredBodyPointSizeLower as readonly number[],
      callerMeasuredBodyPointSizeUpper:
        value.callerMeasuredBodyPointSizeUpper as readonly number[],
      knownMeasuredBodyPointSizeFlags:
        value.knownMeasuredBodyPointSizeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
