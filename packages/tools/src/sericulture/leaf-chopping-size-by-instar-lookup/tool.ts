import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedObservedLeafChopLength: readonly number[];
  readonly callerObservedLeafChopLengthLower: readonly number[];
  readonly callerObservedLeafChopLengthUpper: readonly number[];
  readonly knownObservedLeafChopLengthFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedLeafChopLength",
    label: "Observed observed leaf chop length",
    kind: "numberList",
  },
  {
    id: "callerObservedLeafChopLengthLower",
    label: "Caller observed leaf chop length lower",
    kind: "numberList",
  },
  {
    id: "callerObservedLeafChopLengthUpper",
    label: "Caller observed leaf chop length upper",
    kind: "numberList",
  },
  {
    id: "knownObservedLeafChopLengthFlags",
    label: "Known observed leaf chop length flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedObservedLeafChopLength,
    input.callerObservedLeafChopLengthLower,
    input.callerObservedLeafChopLengthUpper,
    input.knownObservedLeafChopLengthFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedLeafChopLength: [2, 5],
  callerObservedLeafChopLengthLower: [1, 1],
  callerObservedLeafChopLengthUpper: [3, 4],
  knownObservedLeafChopLengthFlags: [1, 0],
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
  id: "sericulture/leaf-chopping-size-by-instar-lookup",
  title: "Leaf Chopping Size By Instar Lookup",
  description:
    "Measured leaf chop size by independently established instar/leaf type against caller bands, not feeding/nutrition suitability. Unknown indices distinguish zero placeholders from known zero margins. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
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
      observedObservedLeafChopLength:
        value.observedObservedLeafChopLength as readonly number[],
      callerObservedLeafChopLengthLower:
        value.callerObservedLeafChopLengthLower as readonly number[],
      callerObservedLeafChopLengthUpper:
        value.callerObservedLeafChopLengthUpper as readonly number[],
      knownObservedLeafChopLengthFlags:
        value.knownObservedLeafChopLengthFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
