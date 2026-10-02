import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rate: number; readonly interval: number };
export type Output = {
  readonly retainedFraction: number;
  readonly accumulationFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rate: { type: "number", exclusiveMinimum: 0 },
    interval: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rate", "interval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedFraction: { type: "number" },
    accumulationFactor: { type: "number" },
  },
  required: ["retainedFraction", "accumulationFactor"],
} as const;
/** Formal first-order research accumulation factor for an explicitly supplied interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rate, interval } = request;
  const compute = (): Output => {
    H.positive(rate);
    H.positive(interval);
    return {
      retainedFraction: Math.exp(-rate * interval),
      accumulationFactor: 1 / -Math.expm1(-rate * interval),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rate: 0.6931471805599453, interval: 1 },
  output: { retainedFraction: 0.5, accumulationFactor: 2 },
} satisfies ToolExample<Input, Output>;
export const pkAccumulationExplicitIntervalFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacokinetics/pk-accumulation-explicit-interval-factor",
      title: "PK Accumulation Explicit Interval Factor Tool",
      description:
        "Formal first-order research accumulation factor for an explicitly supplied interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rate: { type: "number", exclusiveMinimum: 0 },
          interval: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["rate", "interval"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retainedFraction: { type: "number" },
          accumulationFactor: { type: "number" },
        },
        required: ["retainedFraction", "accumulationFactor"],
      },
      ports: {
        inputs: [
          {
            id: "rate",
            label: "Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interval",
            label: "Interval",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            valueType: { type: "number" },
          },
          {
            id: "accumulationFactor",
            label: "Accumulation Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pkAccumulationExplicitIntervalFactorTool.execute;
export default pkAccumulationExplicitIntervalFactorTool;
