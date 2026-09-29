import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedRate: number;
  readonly coveredDuration: number;
  readonly fullDuration: number;
};
export type Output = {
  readonly observedIntegral: number;
  readonly fullBinEquivalent: number;
  readonly coveredFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedRate: { type: "number" },
    coveredDuration: { type: "number", minimum: 0 },
    fullDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedRate", "coveredDuration", "fullDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedIntegral: { type: "number" },
    fullBinEquivalent: { type: "number" },
    coveredFraction: { type: "number" },
  },
  required: ["observedIntegral", "fullBinEquivalent", "coveredFraction"],
} as const;
/** Observed versus constant-rate full-bin equivalents, explicitly preserving coverage rather than silently filling observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedRate, coveredDuration, fullDuration } = request;
  const compute = (): Output => {
    H.positive(fullDuration);
    H.domain(coveredDuration >= 0 && coveredDuration <= fullDuration);
    return {
      observedIntegral: observedRate * coveredDuration,
      fullBinEquivalent: observedRate * fullDuration,
      coveredFraction: coveredDuration / fullDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedRate: 2, coveredDuration: 5, fullDuration: 10 },
  output: { observedIntegral: 10, fullBinEquivalent: 20, coveredFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const radarBinTimeCoverageFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/radar-bin-time-coverage-factor",
    title: "Radar Bin Time Coverage Factor Tool",
    description:
      "Observed versus constant-rate full-bin equivalents, explicitly preserving coverage rather than silently filling observations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedRate: { type: "number" },
        coveredDuration: { type: "number", minimum: 0 },
        fullDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedRate", "coveredDuration", "fullDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedIntegral: { type: "number" },
        fullBinEquivalent: { type: "number" },
        coveredFraction: { type: "number" },
      },
      required: ["observedIntegral", "fullBinEquivalent", "coveredFraction"],
    },
    ports: {
      inputs: [
        {
          id: "observedRate",
          label: "Observed Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coveredDuration",
          label: "Covered Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullDuration",
          label: "Full Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedIntegral",
          label: "Observed Integral",
          valueType: { type: "number" },
        },
        {
          id: "fullBinEquivalent",
          label: "Full Bin Equivalent",
          valueType: { type: "number" },
        },
        {
          id: "coveredFraction",
          label: "Covered Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radarBinTimeCoverageFactorTool.execute;
export default radarBinTimeCoverageFactorTool;
