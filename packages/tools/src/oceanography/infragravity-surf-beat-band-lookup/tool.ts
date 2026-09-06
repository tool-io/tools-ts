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
  readonly observedInfragravityFrequencyHz: readonly number[];
  readonly callerVerifiedInfragravityFrequencyHzLower: readonly number[];
  readonly callerVerifiedInfragravityFrequencyHzUpper: readonly number[];
  readonly knownInfragravityFrequencyHzCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownBandMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriterionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedInfragravityFrequencyHz",
    label: "Observed infragravity frequency hz",
    kind: "numberList",
  },
  {
    id: "callerVerifiedInfragravityFrequencyHzLower",
    label: "Caller verified infragravity frequency hz lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedInfragravityFrequencyHzUpper",
    label: "Caller verified infragravity frequency hz upper",
    kind: "numberList",
  },
  {
    id: "knownInfragravityFrequencyHzCriterionFlags",
    label: "Known infragravity frequency hz criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownInfragravityFrequencyHzCriterionFlags,
    "knownInfragravityFrequencyHzCriterionFlags",
  );
  aligned(
    input.observedInfragravityFrequencyHz,
    input.callerVerifiedInfragravityFrequencyHzLower,
    "observedInfragravityFrequencyHz",
  );
  aligned(
    input.observedInfragravityFrequencyHz,
    input.callerVerifiedInfragravityFrequencyHzUpper,
    "observedInfragravityFrequencyHz",
  );
  aligned(
    input.observedInfragravityFrequencyHz,
    input.knownInfragravityFrequencyHzCriterionFlags,
    "observedInfragravityFrequencyHz",
  );
  input.callerVerifiedInfragravityFrequencyHzLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedInfragravityFrequencyHzUpper[i]),
  );
  return {
    signedKnownBandMargins: input.observedInfragravityFrequencyHz.map((v, i) =>
      input.knownInfragravityFrequencyHzCriterionFlags[i]
        ? Math.min(
            v - input.callerVerifiedInfragravityFrequencyHzLower[i],
            input.callerVerifiedInfragravityFrequencyHzUpper[i] - v,
          )
        : 0,
    ),
    knownReviewIndices: input.observedInfragravityFrequencyHz.flatMap((v, i) =>
      input.knownInfragravityFrequencyHzCriterionFlags[i] &&
      (v < input.callerVerifiedInfragravityFrequencyHzLower[i] ||
        v > input.callerVerifiedInfragravityFrequencyHzUpper[i])
        ? [i]
        : [],
    ),
    unknownCriterionIndices:
      input.knownInfragravityFrequencyHzCriterionFlags.flatMap((v, i) =>
        !v ? [i] : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInfragravityFrequencyHz: [2, 5],
  callerVerifiedInfragravityFrequencyHzLower: [1, 1],
  callerVerifiedInfragravityFrequencyHzUpper: [3, 4],
  knownInfragravityFrequencyHzCriterionFlags: [1, 0],
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
  id: "oceanography/infragravity-surf-beat-band-lookup",
  title: "Infragravity Surf Beat Band Lookup",
  description:
    "Audit independently observed surf-beat frequencies against caller independently verified instrument/study infragravity band, unknown calibration explicitly retained. Unknown criterion indices distinguish zero placeholders from known zero margins. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedInfragravityFrequencyHz:
        value.observedInfragravityFrequencyHz as readonly number[],
      callerVerifiedInfragravityFrequencyHzLower:
        value.callerVerifiedInfragravityFrequencyHzLower as readonly number[],
      callerVerifiedInfragravityFrequencyHzUpper:
        value.callerVerifiedInfragravityFrequencyHzUpper as readonly number[],
      knownInfragravityFrequencyHzCriterionFlags:
        value.knownInfragravityFrequencyHzCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
