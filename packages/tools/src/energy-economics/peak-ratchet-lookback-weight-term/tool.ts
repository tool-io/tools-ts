import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentPeak: number;
  readonly historicalPeak: number;
  readonly ratchetFraction: number;
};
export type Output = {
  readonly ratchetPeak: number;
  readonly billingPeak: number;
  readonly binding: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentPeak: { type: "number", minimum: 0 },
    historicalPeak: { type: "number", minimum: 0 },
    ratchetFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["currentPeak", "historicalPeak", "ratchetFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratchetPeak: { type: "number" },
    billingPeak: { type: "number" },
    binding: { type: "boolean" },
  },
  required: ["ratchetPeak", "billingPeak", "binding"],
} as const;
/** Calculate peak ratchet lookback weight term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentPeak, historicalPeak, ratchetFraction } = request;
  const compute = (): Output => {
    H.domain(currentPeak >= 0 && historicalPeak >= 0);
    H.probability(ratchetFraction);
    return {
      ratchetPeak: historicalPeak * ratchetFraction,
      billingPeak: Math.max(currentPeak, historicalPeak * ratchetFraction),
      binding: historicalPeak * ratchetFraction > currentPeak,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentPeak: 50, historicalPeak: 100, ratchetFraction: 0.8 },
  output: { ratchetPeak: 80, billingPeak: 80, binding: true },
} satisfies ToolExample<Input, Output>;
export const peakRatchetLookbackWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/peak-ratchet-lookback-weight-term",
    title: "Peak Ratchet Lookback Weight Term Tool",
    description:
      "Calculate peak ratchet lookback weight term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentPeak: { type: "number", minimum: 0 },
        historicalPeak: { type: "number", minimum: 0 },
        ratchetFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["currentPeak", "historicalPeak", "ratchetFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratchetPeak: { type: "number" },
        billingPeak: { type: "number" },
        binding: { type: "boolean" },
      },
      required: ["ratchetPeak", "billingPeak", "binding"],
    },
    ports: {
      inputs: [
        {
          id: "currentPeak",
          label: "Current Peak",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "historicalPeak",
          label: "Historical Peak",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratchetFraction",
          label: "Ratchet Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "ratchetPeak",
          label: "Ratchet Peak",
          valueType: { type: "number" },
        },
        {
          id: "billingPeak",
          label: "Billing Peak",
          valueType: { type: "number" },
        },
        { id: "binding", label: "Binding", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = peakRatchetLookbackWeightTermTool.execute;
export default peakRatchetLookbackWeightTermTool;
