import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossUse: number;
  readonly reusedWater: number;
  readonly suppliedCreditFraction: number;
};
export type Output = {
  readonly creditedWater: number;
  readonly netChargedUse: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossUse: { type: "number", minimum: 0 },
    reusedWater: { type: "number", minimum: 0 },
    suppliedCreditFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossUse", "reusedWater", "suppliedCreditFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedWater: { type: "number" },
    netChargedUse: { type: "number" },
  },
  required: ["creditedWater", "netChargedUse"],
} as const;
/** Supplied water billing/allocation credit arithmetic without inferring water quality or irrigation need. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossUse, reusedWater, suppliedCreditFraction } = request;
  const compute = (): Output => {
    H.probability(suppliedCreditFraction);
    H.domain(grossUse >= 0 && reusedWater >= 0 && reusedWater <= grossUse);
    return {
      creditedWater: reusedWater * suppliedCreditFraction,
      netChargedUse: grossUse - reusedWater * suppliedCreditFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossUse: 100, reusedWater: 40, suppliedCreditFraction: 0.5 },
  output: { creditedWater: 20, netChargedUse: 80 },
} satisfies ToolExample<Input, Output>;
export const gardenWaterCreditShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/garden-water-credit-share",
    title: "Garden Water Credit Share Tool",
    description:
      "Supplied water billing/allocation credit arithmetic without inferring water quality or irrigation need.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossUse: { type: "number", minimum: 0 },
        reusedWater: { type: "number", minimum: 0 },
        suppliedCreditFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossUse", "reusedWater", "suppliedCreditFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedWater: { type: "number" },
        netChargedUse: { type: "number" },
      },
      required: ["creditedWater", "netChargedUse"],
    },
    ports: {
      inputs: [
        {
          id: "grossUse",
          label: "Gross Use",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reusedWater",
          label: "Reused Water",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCreditFraction",
          label: "Supplied Credit Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "creditedWater",
          label: "Credited Water",
          valueType: { type: "number" },
        },
        {
          id: "netChargedUse",
          label: "Net Charged Use",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gardenWaterCreditShareTool.execute;
export default gardenWaterCreditShareTool;
