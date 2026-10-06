import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashCost: number;
  readonly economicCost: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashCost: { type: "number" },
    economicCost: { type: "number" },
  },
  required: ["cashCost", "economicCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied economic cost minus cash cost in the same currency and period without estimating opportunity costs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashCost, economicCost } = request;
  const compute = (): Output => {
    return { signedGap: economicCost - cashCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cashCost: 12, economicCost: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const farmCashVsEconomicCostGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/farm-cash-vs-economic-cost-gap",
    title: "Farm Cash Vs Economic Cost Gap",
    description:
      "Calculate supplied economic cost minus cash cost in the same currency and period without estimating opportunity costs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashCost: { type: "number" },
        economicCost: { type: "number" },
      },
      required: ["cashCost", "economicCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "cashCost",
          label: "Cash Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "economicCost",
          label: "Economic Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmCashVsEconomicCostGapTool.execute;
export default farmCashVsEconomicCostGapTool;
