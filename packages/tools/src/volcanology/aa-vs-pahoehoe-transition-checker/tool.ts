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
  readonly observedLavaTransitionObservedStrainRate: readonly number[];
  readonly callerVerifiedLavaTransitionObservedStrainRateLower: readonly number[];
  readonly callerVerifiedLavaTransitionObservedStrainRateUpper: readonly number[];
  readonly knownLavaTransitionObservedStrainRateCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownBandMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriterionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedLavaTransitionObservedStrainRate",
    label: "Observed lava transition observed strain rate",
    kind: "numberList",
  },
  {
    id: "callerVerifiedLavaTransitionObservedStrainRateLower",
    label: "Caller verified lava transition observed strain rate lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedLavaTransitionObservedStrainRateUpper",
    label: "Caller verified lava transition observed strain rate upper",
    kind: "numberList",
  },
  {
    id: "knownLavaTransitionObservedStrainRateCriterionFlags",
    label: "Known lava transition observed strain rate criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownLavaTransitionObservedStrainRateCriterionFlags,
    "knownLavaTransitionObservedStrainRateCriterionFlags",
  );
  aligned(
    input.observedLavaTransitionObservedStrainRate,
    input.callerVerifiedLavaTransitionObservedStrainRateLower,
    "observedLavaTransitionObservedStrainRate",
  );
  aligned(
    input.observedLavaTransitionObservedStrainRate,
    input.callerVerifiedLavaTransitionObservedStrainRateUpper,
    "observedLavaTransitionObservedStrainRate",
  );
  aligned(
    input.observedLavaTransitionObservedStrainRate,
    input.knownLavaTransitionObservedStrainRateCriterionFlags,
    "observedLavaTransitionObservedStrainRate",
  );
  input.callerVerifiedLavaTransitionObservedStrainRateLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedLavaTransitionObservedStrainRateUpper[i]),
  );
  return {
    signedKnownBandMargins: input.observedLavaTransitionObservedStrainRate.map(
      (v, i) =>
        input.knownLavaTransitionObservedStrainRateCriterionFlags[i]
          ? Math.min(
              v - input.callerVerifiedLavaTransitionObservedStrainRateLower[i],
              input.callerVerifiedLavaTransitionObservedStrainRateUpper[i] - v,
            )
          : 0,
    ),
    knownReviewIndices: input.observedLavaTransitionObservedStrainRate.flatMap(
      (v, i) =>
        input.knownLavaTransitionObservedStrainRateCriterionFlags[i] &&
        (v < input.callerVerifiedLavaTransitionObservedStrainRateLower[i] ||
          v > input.callerVerifiedLavaTransitionObservedStrainRateUpper[i])
          ? [i]
          : [],
    ),
    unknownCriterionIndices:
      input.knownLavaTransitionObservedStrainRateCriterionFlags.flatMap(
        (v, i) => (!v ? [i] : []),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLavaTransitionObservedStrainRate: [2, 5],
  callerVerifiedLavaTransitionObservedStrainRateLower: [1, 1],
  callerVerifiedLavaTransitionObservedStrainRateUpper: [3, 4],
  knownLavaTransitionObservedStrainRateCriterionFlags: [1, 0],
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
  id: "volcanology/aa-vs-pahoehoe-transition-checker",
  title: "AA vs Pahoehoe Transition Checker",
  description:
    "Screen independently observed strain-rate evidence against independently matched temperature/crystal/composition transition band, no universal AA/pahoehoe classification. Unknown criterion indices distinguish zero placeholders from known zero margins. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedLavaTransitionObservedStrainRate:
        value.observedLavaTransitionObservedStrainRate as readonly number[],
      callerVerifiedLavaTransitionObservedStrainRateLower:
        value.callerVerifiedLavaTransitionObservedStrainRateLower as readonly number[],
      callerVerifiedLavaTransitionObservedStrainRateUpper:
        value.callerVerifiedLavaTransitionObservedStrainRateUpper as readonly number[],
      knownLavaTransitionObservedStrainRateCriterionFlags:
        value.knownLavaTransitionObservedStrainRateCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
