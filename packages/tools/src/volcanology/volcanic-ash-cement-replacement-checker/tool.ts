import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  ordered,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedAshBinderObservedTest: readonly number[];
  readonly callerVerifiedAshBinderObservedTestLower: readonly number[];
  readonly callerVerifiedAshBinderObservedTestUpper: readonly number[];
  readonly knownAshBinderObservedTestCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownBandMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriterionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAshBinderObservedTest",
    label: "Observed ash binder observed test",
    kind: "numberList",
  },
  {
    id: "callerVerifiedAshBinderObservedTestLower",
    label: "Caller verified ash binder observed test lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedAshBinderObservedTestUpper",
    label: "Caller verified ash binder observed test upper",
    kind: "numberList",
  },
  {
    id: "knownAshBinderObservedTestCriterionFlags",
    label: "Known ash binder observed test criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownAshBinderObservedTestCriterionFlags,
    "knownAshBinderObservedTestCriterionFlags",
  );
  aligned(
    input.observedAshBinderObservedTest,
    input.callerVerifiedAshBinderObservedTestLower,
    "observedAshBinderObservedTest",
  );
  aligned(
    input.observedAshBinderObservedTest,
    input.callerVerifiedAshBinderObservedTestUpper,
    "observedAshBinderObservedTest",
  );
  aligned(
    input.observedAshBinderObservedTest,
    input.knownAshBinderObservedTestCriterionFlags,
    "observedAshBinderObservedTest",
  );
  input.callerVerifiedAshBinderObservedTestLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedAshBinderObservedTestUpper[i]),
  );
  return {
    signedKnownBandMargins: input.observedAshBinderObservedTest.map((v, i) =>
      input.knownAshBinderObservedTestCriterionFlags[i]
        ? Math.min(
            v - input.callerVerifiedAshBinderObservedTestLower[i],
            input.callerVerifiedAshBinderObservedTestUpper[i] - v,
          )
        : 0,
    ),
    knownReviewIndices: input.observedAshBinderObservedTest.flatMap((v, i) =>
      input.knownAshBinderObservedTestCriterionFlags[i] &&
      (v < input.callerVerifiedAshBinderObservedTestLower[i] ||
        v > input.callerVerifiedAshBinderObservedTestUpper[i])
        ? [i]
        : [],
    ),
    unknownCriterionIndices:
      input.knownAshBinderObservedTestCriterionFlags.flatMap((v, i) =>
        !v ? [i] : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAshBinderObservedTest: [2, 5],
  callerVerifiedAshBinderObservedTestLower: [1, 1],
  callerVerifiedAshBinderObservedTestUpper: [3, 4],
  knownAshBinderObservedTestCriterionFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownBandMargins: [1, 0],
  knownReviewIndices: [],
  unknownCriterionIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/volcanic-ash-cement-replacement-checker",
  title: "Volcanic Ash Cement Replacement Safe Checker",
  description:
    "Audit actual independently observed ash binder test evidence against caller same-method/edition acceptance bands; does NOT establish safe replacement, cement compliance or a mixing recommendation. Unknown criterion indices distinguish zero placeholders from known zero margins. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownBandMargins",
      label: "Signed known band margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
      kind: "numberList",
    },
    {
      id: "unknownCriterionIndices",
      label: "Unknown criterion indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAshBinderObservedTest:
        value.observedAshBinderObservedTest as readonly number[],
      callerVerifiedAshBinderObservedTestLower:
        value.callerVerifiedAshBinderObservedTestLower as readonly number[],
      callerVerifiedAshBinderObservedTestUpper:
        value.callerVerifiedAshBinderObservedTestUpper as readonly number[],
      knownAshBinderObservedTestCriterionFlags:
        value.knownAshBinderObservedTestCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
