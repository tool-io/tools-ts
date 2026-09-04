import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  ordered,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedHumFrequencyWeightedDecibels: readonly number[];
  readonly callerVerifiedHumFrequencyWeightedDecibelsLower: readonly number[];
  readonly callerVerifiedHumFrequencyWeightedDecibelsUpper: readonly number[];
  readonly knownHumFrequencyWeightedDecibelsCriteriaFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriteriaIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedHumFrequencyWeightedDecibels",
    label: "Observed hum frequency weighted decibels",
    kind: "numberList",
  },
  {
    id: "callerVerifiedHumFrequencyWeightedDecibelsLower",
    label: "Caller verified hum frequency weighted decibels lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedHumFrequencyWeightedDecibelsUpper",
    label: "Caller verified hum frequency weighted decibels upper",
    kind: "numberList",
  },
  {
    id: "knownHumFrequencyWeightedDecibelsCriteriaFlags",
    label: "Known hum frequency weighted decibels criteria flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownHumFrequencyWeightedDecibelsCriteriaFlags,
    "knownHumFrequencyWeightedDecibelsCriteriaFlags",
  );
  aligned(
    input.observedHumFrequencyWeightedDecibels,
    input.callerVerifiedHumFrequencyWeightedDecibelsLower,
    "observedHumFrequencyWeightedDecibels",
  );
  aligned(
    input.observedHumFrequencyWeightedDecibels,
    input.callerVerifiedHumFrequencyWeightedDecibelsUpper,
    "observedHumFrequencyWeightedDecibels",
  );
  aligned(
    input.observedHumFrequencyWeightedDecibels,
    input.knownHumFrequencyWeightedDecibelsCriteriaFlags,
    "observedHumFrequencyWeightedDecibels",
  );
  input.callerVerifiedHumFrequencyWeightedDecibelsLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedHumFrequencyWeightedDecibelsUpper[i]),
  );
  return {
    signedKnownMargins: input.observedHumFrequencyWeightedDecibels.map(
      (v, i) =>
        input.knownHumFrequencyWeightedDecibelsCriteriaFlags[i]
          ? Math.min(
              v - input.callerVerifiedHumFrequencyWeightedDecibelsLower[i],
              input.callerVerifiedHumFrequencyWeightedDecibelsUpper[i] - v,
            )
          : 0,
    ),
    knownReviewIndices: input.observedHumFrequencyWeightedDecibels.flatMap(
      (v, i) =>
        input.knownHumFrequencyWeightedDecibelsCriteriaFlags[i] &&
        (v < input.callerVerifiedHumFrequencyWeightedDecibelsLower[i] ||
          v > input.callerVerifiedHumFrequencyWeightedDecibelsUpper[i])
          ? [i]
          : [],
    ),
    unknownCriteriaIndices:
      input.knownHumFrequencyWeightedDecibelsCriteriaFlags.flatMap((v, i) =>
        !v ? [i] : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHumFrequencyWeightedDecibels: [2, 5],
  callerVerifiedHumFrequencyWeightedDecibelsLower: [1, 1],
  callerVerifiedHumFrequencyWeightedDecibelsUpper: [3, 4],
  knownHumFrequencyWeightedDecibelsCriteriaFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownMargins: [1, 0],
  knownReviewIndices: [],
  unknownCriteriaIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/background-hum-band-classifier",
  title: "Background Hum Annoyance Decibel Band Classifier",
  description:
    "Audit independently weighted background tonal-hum measurements against caller context-specific annoyance intervals; no equal dB perceptual response assumed. Unknown criteria explicitly distinguish zero placeholders. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
    {
      id: "unknownCriteriaIndices",
      label: "Unknown criteria indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHumFrequencyWeightedDecibels:
        value.observedHumFrequencyWeightedDecibels as readonly number[],
      callerVerifiedHumFrequencyWeightedDecibelsLower:
        value.callerVerifiedHumFrequencyWeightedDecibelsLower as readonly number[],
      callerVerifiedHumFrequencyWeightedDecibelsUpper:
        value.callerVerifiedHumFrequencyWeightedDecibelsUpper as readonly number[],
      knownHumFrequencyWeightedDecibelsCriteriaFlags:
        value.knownHumFrequencyWeightedDecibelsCriteriaFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
