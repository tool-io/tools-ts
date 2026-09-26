import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentPeak: number;
  readonly historicalPeak: number;
  readonly ratchetFraction: number;
  readonly pricePerKw: number;
};
export type Output = { readonly billedKw: number; readonly charge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentPeak: { type: "number", minimum: 0 },
    historicalPeak: { type: "number", minimum: 0 },
    ratchetFraction: { type: "number", minimum: 0, maximum: 1 },
    pricePerKw: { type: "number" },
  },
  required: ["currentPeak", "historicalPeak", "ratchetFraction", "pricePerKw"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { billedKw: { type: "number" }, charge: { type: "number" } },
  required: ["billedKw", "charge"],
} as const;
/** Calculate demand charge ratchet one month term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentPeak, historicalPeak, ratchetFraction, pricePerKw } = request;
  const compute = (): Output => {
    H.domain(currentPeak >= 0 && historicalPeak >= 0);
    H.probability(ratchetFraction);
    return {
      billedKw: Math.max(currentPeak, historicalPeak * ratchetFraction),
      charge:
        Math.max(currentPeak, historicalPeak * ratchetFraction) * pricePerKw,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentPeak: 80,
    historicalPeak: 120,
    ratchetFraction: 0.75,
    pricePerKw: 10,
  },
  output: { billedKw: 90, charge: 900 },
} satisfies ToolExample<Input, Output>;
export const demandChargeRatchetOneMonthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/demand-charge-ratchet-one-month-term",
    title: "Demand Charge Ratchet One Month Term Tool",
    description:
      "Calculate demand charge ratchet one month term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentPeak: { type: "number", minimum: 0 },
        historicalPeak: { type: "number", minimum: 0 },
        ratchetFraction: { type: "number", minimum: 0, maximum: 1 },
        pricePerKw: { type: "number" },
      },
      required: [
        "currentPeak",
        "historicalPeak",
        "ratchetFraction",
        "pricePerKw",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { billedKw: { type: "number" }, charge: { type: "number" } },
      required: ["billedKw", "charge"],
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
          valueType: { type: "number" },
        },
        {
          id: "pricePerKw",
          label: "Price Per Kw",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "billedKw", label: "Billed Kw", valueType: { type: "number" } },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = demandChargeRatchetOneMonthTermTool.execute;
export default demandChargeRatchetOneMonthTermTool;
