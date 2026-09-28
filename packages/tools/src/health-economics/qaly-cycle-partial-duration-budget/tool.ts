import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly utility: number;
  readonly cycleYears: number;
  readonly coveredFraction: number;
};
export type Output = {
  readonly coveredYears: number;
  readonly utilityYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utility: { type: "number" },
    cycleYears: { type: "number", minimum: 0 },
    coveredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["utility", "cycleYears", "coveredFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredYears: { type: "number" },
    utilityYears: { type: "number" },
  },
  required: ["coveredYears", "utilityYears"],
} as const;
/** Constant supplied utility over a covered cycle fraction, without discounting or half-cycle correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { utility, cycleYears, coveredFraction } = request;
  const compute = (): Output => {
    H.domain(cycleYears >= 0);
    H.probability(coveredFraction);
    return {
      coveredYears: cycleYears * coveredFraction,
      utilityYears: utility * cycleYears * coveredFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { utility: 0.8, cycleYears: 0.5, coveredFraction: 0.5 },
  output: { coveredYears: 0.25, utilityYears: 0.2 },
} satisfies ToolExample<Input, Output>;
export const qalyCyclePartialDurationBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/qaly-cycle-partial-duration-budget",
    title: "QALY Cycle Partial Duration Budget Tool",
    description:
      "Constant supplied utility over a covered cycle fraction, without discounting or half-cycle correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utility: { type: "number" },
        cycleYears: { type: "number", minimum: 0 },
        coveredFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["utility", "cycleYears", "coveredFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredYears: { type: "number" },
        utilityYears: { type: "number" },
      },
      required: ["coveredYears", "utilityYears"],
    },
    ports: {
      inputs: [
        {
          id: "utility",
          label: "Utility",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleYears",
          label: "Cycle Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coveredFraction",
          label: "Covered Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coveredYears",
          label: "Covered Years",
          valueType: { type: "number" },
        },
        {
          id: "utilityYears",
          label: "Utility Years",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = qalyCyclePartialDurationBudgetTool.execute;
export default qalyCyclePartialDurationBudgetTool;
