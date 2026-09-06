import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedSurchargeOffsetMm: readonly number[];
  readonly callerSurchargeOffsetMmLower: readonly number[];
  readonly callerSurchargeOffsetMmUpper: readonly number[];
  readonly knownSurchargeOffsetMmFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSurchargeOffsetMm",
    label: "Observed surcharge offset mm",
    kind: "numberList",
  },
  {
    id: "callerSurchargeOffsetMmLower",
    label: "Caller surcharge offset mm lower",
    kind: "numberList",
  },
  {
    id: "callerSurchargeOffsetMmUpper",
    label: "Caller surcharge offset mm upper",
    kind: "numberList",
  },
  {
    id: "knownSurchargeOffsetMmFlags",
    label: "Known surcharge offset mm flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedSurchargeOffsetMm,
    input.callerSurchargeOffsetMmLower,
    input.callerSurchargeOffsetMmUpper,
    input.knownSurchargeOffsetMmFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSurchargeOffsetMm: [2, 5],
  callerSurchargeOffsetMmLower: [1, 1],
  callerSurchargeOffsetMmUpper: [3, 4],
  knownSurchargeOffsetMmFlags: [1, 0],
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
  id: "philately/surcharge-alignment-offset-checker",
  title: "Surcharge Value Digit Alignment Offset Checker",
  description:
    "Compare observed surcharge digit alignment offsets with caller issue-specific tolerances. Missing observations remain explicit. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      observedSurchargeOffsetMm:
        value.observedSurchargeOffsetMm as readonly number[],
      callerSurchargeOffsetMmLower:
        value.callerSurchargeOffsetMmLower as readonly number[],
      callerSurchargeOffsetMmUpper:
        value.callerSurchargeOffsetMmUpper as readonly number[],
      knownSurchargeOffsetMmFlags:
        value.knownSurchargeOffsetMmFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
