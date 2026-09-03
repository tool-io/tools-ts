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
  readonly observedEfflorescenceObservedSaltMoisture: readonly number[];
  readonly callerVerifiedEfflorescenceObservedSaltMoistureLower: readonly number[];
  readonly callerVerifiedEfflorescenceObservedSaltMoistureUpper: readonly number[];
  readonly knownEfflorescenceObservedSaltMoistureCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownBandMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriterionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedEfflorescenceObservedSaltMoisture",
    label: "Observed efflorescence observed salt moisture",
    kind: "numberList",
  },
  {
    id: "callerVerifiedEfflorescenceObservedSaltMoistureLower",
    label: "Caller verified efflorescence observed salt moisture lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedEfflorescenceObservedSaltMoistureUpper",
    label: "Caller verified efflorescence observed salt moisture upper",
    kind: "numberList",
  },
  {
    id: "knownEfflorescenceObservedSaltMoistureCriterionFlags",
    label: "Known efflorescence observed salt moisture criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownEfflorescenceObservedSaltMoistureCriterionFlags,
    "knownEfflorescenceObservedSaltMoistureCriterionFlags",
  );
  aligned(
    input.observedEfflorescenceObservedSaltMoisture,
    input.callerVerifiedEfflorescenceObservedSaltMoistureLower,
    "observedEfflorescenceObservedSaltMoisture",
  );
  aligned(
    input.observedEfflorescenceObservedSaltMoisture,
    input.callerVerifiedEfflorescenceObservedSaltMoistureUpper,
    "observedEfflorescenceObservedSaltMoisture",
  );
  aligned(
    input.observedEfflorescenceObservedSaltMoisture,
    input.knownEfflorescenceObservedSaltMoistureCriterionFlags,
    "observedEfflorescenceObservedSaltMoisture",
  );
  input.callerVerifiedEfflorescenceObservedSaltMoistureLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedEfflorescenceObservedSaltMoistureUpper[i]),
  );
  return {
    signedKnownBandMargins: input.observedEfflorescenceObservedSaltMoisture.map(
      (v, i) =>
        input.knownEfflorescenceObservedSaltMoistureCriterionFlags[i]
          ? Math.min(
              v - input.callerVerifiedEfflorescenceObservedSaltMoistureLower[i],
              input.callerVerifiedEfflorescenceObservedSaltMoistureUpper[i] - v,
            )
          : 0,
    ),
    knownReviewIndices: input.observedEfflorescenceObservedSaltMoisture.flatMap(
      (v, i) =>
        input.knownEfflorescenceObservedSaltMoistureCriterionFlags[i] &&
        (v < input.callerVerifiedEfflorescenceObservedSaltMoistureLower[i] ||
          v > input.callerVerifiedEfflorescenceObservedSaltMoistureUpper[i])
          ? [i]
          : [],
    ),
    unknownCriterionIndices:
      input.knownEfflorescenceObservedSaltMoistureCriterionFlags.flatMap(
        (v, i) => (!v ? [i] : []),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEfflorescenceObservedSaltMoisture: [2, 5],
  callerVerifiedEfflorescenceObservedSaltMoistureLower: [1, 1],
  callerVerifiedEfflorescenceObservedSaltMoistureUpper: [3, 4],
  knownEfflorescenceObservedSaltMoistureCriterionFlags: [1, 0],
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
  id: "construction/efflorescence-risk",
  title: "Efflorescence Risk Checker",
  description:
    "Audit independently measured salt/moisture evidence against explicit caller study bands, missing evidence reported; not quantified future risk or remediation. Unknown criterion indices distinguish zero placeholders from known zero margins. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedEfflorescenceObservedSaltMoisture:
        value.observedEfflorescenceObservedSaltMoisture as readonly number[],
      callerVerifiedEfflorescenceObservedSaltMoistureLower:
        value.callerVerifiedEfflorescenceObservedSaltMoistureLower as readonly number[],
      callerVerifiedEfflorescenceObservedSaltMoistureUpper:
        value.callerVerifiedEfflorescenceObservedSaltMoistureUpper as readonly number[],
      knownEfflorescenceObservedSaltMoistureCriterionFlags:
        value.knownEfflorescenceObservedSaltMoistureCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
