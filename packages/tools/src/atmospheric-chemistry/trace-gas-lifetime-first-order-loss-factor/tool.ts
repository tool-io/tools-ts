import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lossRate: number;
  readonly elapsed: number;
  readonly initialConcentration: number;
};
export type Output = {
  readonly lifetime: number;
  readonly retainedFraction: number;
  readonly concentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lossRate: { type: "number", exclusiveMinimum: 0 },
    elapsed: { type: "number", minimum: 0 },
    initialConcentration: { type: "number", minimum: 0 },
  },
  required: ["lossRate", "elapsed", "initialConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lifetime: { type: "number" },
    retainedFraction: { type: "number" },
    concentration: { type: "number" },
  },
  required: ["lifetime", "retainedFraction", "concentration"],
} as const;
/** Calculate trace gas lifetime first order loss factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lossRate, elapsed, initialConcentration } = request;
  const compute = (): Output => {
    H.positive(lossRate);
    H.domain(elapsed >= 0 && initialConcentration >= 0);
    return {
      lifetime: 1 / lossRate,
      retainedFraction: Math.exp(-lossRate * elapsed),
      concentration: initialConcentration * Math.exp(-lossRate * elapsed),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lossRate: 0.5, elapsed: 2, initialConcentration: 100 },
  output: {
    lifetime: 2,
    retainedFraction: 0.36787944117144233,
    concentration: 36.787944117144235,
  },
} satisfies ToolExample<Input, Output>;
export const traceGasLifetimeFirstOrderLossFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-chemistry/trace-gas-lifetime-first-order-loss-factor",
      title: "Trace Gas Lifetime First Order Loss Factor Tool",
      description:
        "Calculate trace gas lifetime first order loss factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lossRate: { type: "number", exclusiveMinimum: 0 },
          elapsed: { type: "number", minimum: 0 },
          initialConcentration: { type: "number", minimum: 0 },
        },
        required: ["lossRate", "elapsed", "initialConcentration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lifetime: { type: "number" },
          retainedFraction: { type: "number" },
          concentration: { type: "number" },
        },
        required: ["lifetime", "retainedFraction", "concentration"],
      },
      ports: {
        inputs: [
          {
            id: "lossRate",
            label: "Loss Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsed",
            label: "Elapsed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialConcentration",
            label: "Initial Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "lifetime", label: "Lifetime", valueType: { type: "number" } },
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            valueType: { type: "number" },
          },
          {
            id: "concentration",
            label: "Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = traceGasLifetimeFirstOrderLossFactorTool.execute;
export default traceGasLifetimeFirstOrderLossFactorTool;
