import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  integer,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedLightningFlashCounts: readonly number[];
  readonly observedMatchedDetectionSeconds: readonly number[];
  readonly callerIndependentlyVerifiedFlashDetectionFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly detectionAdjustedObservedFlashRateSecond: number;
}>;
const inputFields = [
  {
    id: "observedLightningFlashCounts",
    label: "Observed lightning flash counts",
    kind: "numberList",
  },
  {
    id: "observedMatchedDetectionSeconds",
    label: "Observed matched detection seconds",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyVerifiedFlashDetectionFractions",
    label: "Caller independently verified flash detection fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedDetectionSeconds.forEach((v) =>
    positive(v, "observedMatchedDetectionSeconds"),
  );
  input.callerIndependentlyVerifiedFlashDetectionFractions.forEach((v) =>
    positive(v, "callerIndependentlyVerifiedFlashDetectionFractions"),
  );
  input.observedLightningFlashCounts.forEach((v) =>
    nonnegative(v, "observedLightningFlashCounts"),
  );
  input.callerIndependentlyVerifiedFlashDetectionFractions.forEach((v) =>
    fraction(v, "callerIndependentlyVerifiedFlashDetectionFractions"),
  );
  aligned(
    input.observedLightningFlashCounts,
    input.observedMatchedDetectionSeconds,
    "observedLightningFlashCounts",
  );
  aligned(
    input.observedLightningFlashCounts,
    input.callerIndependentlyVerifiedFlashDetectionFractions,
    "observedLightningFlashCounts",
  );
  input.observedLightningFlashCounts.forEach((v) => integer(v, "flashes"));
  return {
    detectionAdjustedObservedFlashRateSecond:
      sum(
        input.observedLightningFlashCounts.map(
          (v, i) =>
            v / input.callerIndependentlyVerifiedFlashDetectionFractions[i],
        ),
      ) / sum(input.observedMatchedDetectionSeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLightningFlashCounts: [10, 20],
  observedMatchedDetectionSeconds: [5, 10],
  callerIndependentlyVerifiedFlashDetectionFractions: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  detectionAdjustedObservedFlashRateSecond: 2.6666666666666665,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/volcanic-lightning-flash-count-proxy",
  title: "Volcanic Lightning Flash Count Proxy Tool",
  description:
    "Observed flash/time proxy corrected with independently calibrated detection fraction, not ash mass-rate inference, volcano causality or hazard forecast. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "detectionAdjustedObservedFlashRateSecond",
      label: "Detection adjusted observed flash rate second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLightningFlashCounts:
        value.observedLightningFlashCounts as readonly number[],
      observedMatchedDetectionSeconds:
        value.observedMatchedDetectionSeconds as readonly number[],
      callerIndependentlyVerifiedFlashDetectionFractions:
        value.callerIndependentlyVerifiedFlashDetectionFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
