import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedObservedProtocolMiteIndicator: readonly number[];
  readonly callerObservedProtocolMiteIndicatorLower: readonly number[];
  readonly callerObservedProtocolMiteIndicatorUpper: readonly number[];
  readonly knownObservedProtocolMiteIndicatorFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedProtocolMiteIndicator",
    label: "Observed observed protocol mite indicator",
    kind: "numberList",
  },
  {
    id: "callerObservedProtocolMiteIndicatorLower",
    label: "Caller observed protocol mite indicator lower",
    kind: "numberList",
  },
  {
    id: "callerObservedProtocolMiteIndicatorUpper",
    label: "Caller observed protocol mite indicator upper",
    kind: "numberList",
  },
  {
    id: "knownObservedProtocolMiteIndicatorFlags",
    label: "Known observed protocol mite indicator flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedObservedProtocolMiteIndicator,
    input.callerObservedProtocolMiteIndicatorLower,
    input.callerObservedProtocolMiteIndicatorUpper,
    input.knownObservedProtocolMiteIndicatorFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedProtocolMiteIndicator: [2, 5],
  callerObservedProtocolMiteIndicatorLower: [1, 1],
  callerObservedProtocolMiteIndicatorUpper: [3, 4],
  knownObservedProtocolMiteIndicatorFlags: [1, 0],
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
  id: "apiculture/treatment-threshold-level-checker",
  title: "Treatment Threshold Level Checker",
  description:
    "Independent measured mite indicator vs independently applicable site/season/protocol monitoring bands; flags only, no chemical treatment choice, rate or efficacy claim. Unknown indices distinguish zero placeholders from known zero margins. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      observedObservedProtocolMiteIndicator:
        value.observedObservedProtocolMiteIndicator as readonly number[],
      callerObservedProtocolMiteIndicatorLower:
        value.callerObservedProtocolMiteIndicatorLower as readonly number[],
      callerObservedProtocolMiteIndicatorUpper:
        value.callerObservedProtocolMiteIndicatorUpper as readonly number[],
      knownObservedProtocolMiteIndicatorFlags:
        value.knownObservedProtocolMiteIndicatorFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
