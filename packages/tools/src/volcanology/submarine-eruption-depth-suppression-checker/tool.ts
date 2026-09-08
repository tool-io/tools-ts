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
  readonly observedSubmarineObservedGasPressureContrastPa: readonly number[];
  readonly callerVerifiedSubmarineObservedGasPressureContrastPaLower: readonly number[];
  readonly callerVerifiedSubmarineObservedGasPressureContrastPaUpper: readonly number[];
  readonly knownSubmarineObservedGasPressureContrastPaCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownBandMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriterionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSubmarineObservedGasPressureContrastPa",
    label: "Observed submarine observed gas pressure contrast pa",
    kind: "numberList",
  },
  {
    id: "callerVerifiedSubmarineObservedGasPressureContrastPaLower",
    label: "Caller verified submarine observed gas pressure contrast pa lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedSubmarineObservedGasPressureContrastPaUpper",
    label: "Caller verified submarine observed gas pressure contrast pa upper",
    kind: "numberList",
  },
  {
    id: "knownSubmarineObservedGasPressureContrastPaCriterionFlags",
    label: "Known submarine observed gas pressure contrast pa criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownSubmarineObservedGasPressureContrastPaCriterionFlags,
    "knownSubmarineObservedGasPressureContrastPaCriterionFlags",
  );
  aligned(
    input.observedSubmarineObservedGasPressureContrastPa,
    input.callerVerifiedSubmarineObservedGasPressureContrastPaLower,
    "observedSubmarineObservedGasPressureContrastPa",
  );
  aligned(
    input.observedSubmarineObservedGasPressureContrastPa,
    input.callerVerifiedSubmarineObservedGasPressureContrastPaUpper,
    "observedSubmarineObservedGasPressureContrastPa",
  );
  aligned(
    input.observedSubmarineObservedGasPressureContrastPa,
    input.knownSubmarineObservedGasPressureContrastPaCriterionFlags,
    "observedSubmarineObservedGasPressureContrastPa",
  );
  input.callerVerifiedSubmarineObservedGasPressureContrastPaLower.forEach(
    (v, i) =>
      ordered(
        v,
        input.callerVerifiedSubmarineObservedGasPressureContrastPaUpper[i],
      ),
  );
  return {
    signedKnownBandMargins:
      input.observedSubmarineObservedGasPressureContrastPa.map((v, i) =>
        input.knownSubmarineObservedGasPressureContrastPaCriterionFlags[i]
          ? Math.min(
              v -
                input.callerVerifiedSubmarineObservedGasPressureContrastPaLower[
                  i
                ],
              input.callerVerifiedSubmarineObservedGasPressureContrastPaUpper[
                i
              ] - v,
            )
          : 0,
      ),
    knownReviewIndices:
      input.observedSubmarineObservedGasPressureContrastPa.flatMap((v, i) =>
        input.knownSubmarineObservedGasPressureContrastPaCriterionFlags[i] &&
        (v <
          input.callerVerifiedSubmarineObservedGasPressureContrastPaLower[i] ||
          v >
            input.callerVerifiedSubmarineObservedGasPressureContrastPaUpper[i])
          ? [i]
          : [],
      ),
    unknownCriterionIndices:
      input.knownSubmarineObservedGasPressureContrastPaCriterionFlags.flatMap(
        (v, i) => (!v ? [i] : []),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSubmarineObservedGasPressureContrastPa: [2, 5],
  callerVerifiedSubmarineObservedGasPressureContrastPaLower: [1, 1],
  callerVerifiedSubmarineObservedGasPressureContrastPaUpper: [3, 4],
  knownSubmarineObservedGasPressureContrastPaCriterionFlags: [1, 0],
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
  id: "volcanology/submarine-eruption-depth-suppression-checker",
  title: "Submarine Eruption Depth Suppression Checker",
  description:
    "Audit independently established gas/ambient pressure contrasts against caller matched suppression-model evidence bands, no eruption-depth safety guarantee or hydrostatic-only forecast. Unknown criterion indices distinguish zero placeholders from known zero margins. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedSubmarineObservedGasPressureContrastPa:
        value.observedSubmarineObservedGasPressureContrastPa as readonly number[],
      callerVerifiedSubmarineObservedGasPressureContrastPaLower:
        value.callerVerifiedSubmarineObservedGasPressureContrastPaLower as readonly number[],
      callerVerifiedSubmarineObservedGasPressureContrastPaUpper:
        value.callerVerifiedSubmarineObservedGasPressureContrastPaUpper as readonly number[],
      knownSubmarineObservedGasPressureContrastPaCriterionFlags:
        value.knownSubmarineObservedGasPressureContrastPaCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
