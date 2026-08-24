import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TempoAdjustedTfrBongaartsInput = {
  readonly meanAgeAnnualChangeYears: number;
  readonly observedTfr: number;
};

export type TempoAdjustedTfrBongaartsOutput = {
  readonly tempoAdjustedTfr: number;
};

export const tempoAdjustedTfrBongaartsExample = {
  input: {
    meanAgeAnnualChangeYears: 0.03,
    observedTfr: 1.7,
  },
  output: {
    tempoAdjustedTfr: 1.7525773195876289,
  },
} satisfies ToolExample<
  TempoAdjustedTfrBongaartsInput,
  TempoAdjustedTfrBongaartsOutput
>;

export const calculateTempoAdjustedTfr = (
  input: TempoAdjustedTfrBongaartsInput,
): TempoAdjustedTfrBongaartsOutput => {
  if (!Number.isFinite(input.observedTfr) || input.observedTfr < 0)
    simpleError(
      "observedTfr",
      "Observed TFR must be a finite nonnegative number.",
      "invalid_value",
    );
  if (!Number.isFinite(input.meanAgeAnnualChangeYears))
    simpleError(
      "meanAgeAnnualChangeYears",
      "The annual mean-age change must be finite.",
      "invalid_value",
    );
  const denominator = 1 - input.meanAgeAnnualChangeYears;
  if (denominator <= 0)
    simpleError(
      "meanAgeAnnualChangeYears",
      "The annual change in mean age at childbearing must stay below one year.",
      "invalid_value",
    );
  const tempoAdjustedTfr = input.observedTfr / denominator;
  if (!Number.isFinite(tempoAdjustedTfr))
    simpleError(
      "meanAgeAnnualChangeYears",
      "The adjusted TFR is outside the finite numeric range.",
      "numeric_range",
    );
  return { tempoAdjustedTfr };
};

export const tempoAdjustedTfrBongaartsTool = createSimpleTool({
  calculate: (input) =>
    calculateTempoAdjustedTfr({
      meanAgeAnnualChangeYears: input.meanAgeAnnualChangeYears as number,
      observedTfr: input.observedTfr as number,
    }),
  description:
    "Apply the Bongaarts-Feeney tempo adjustment to recover the period fertility rate free of postponement distortion.",
  id: "sociology/tempo-adjusted-tfr-bongaarts",
  inputs: [
    {
      description:
        "Year-over-year change in mean age at childbearing; positive means births are being postponed.",
      id: "meanAgeAnnualChangeYears",
      kind: "number",
      label: "Mean age shift",
      maximum: 0.99,
    },
    {
      description: "Observed period total fertility rate.",
      id: "observedTfr",
      kind: "number",
      label: "Observed TFR",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Tempo-adjusted TFR that would prevail without postponement.",
      id: "tempoAdjustedTfr",
      kind: "number",
      label: "Tempo-adjusted TFR",
    },
  ],
  title: "Bongaarts Tempo-Adjusted TFR Calculator",
});
export const runTempoAdjustedTfrBongaarts =
  tempoAdjustedTfrBongaartsTool.execute;
export default tempoAdjustedTfrBongaartsTool;
