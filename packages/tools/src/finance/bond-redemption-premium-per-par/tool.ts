import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly redemptionAmount: number;
  readonly parAmount: number;
};
export type Output = {
  readonly premiumAmount: number;
  readonly premiumPercentOfPar: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redemptionAmount: { type: "number", minimum: 0 },
    parAmount: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["redemptionAmount", "parAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premiumAmount: { type: "number" },
    premiumPercentOfPar: { type: "number" },
  },
  required: ["premiumAmount", "premiumPercentOfPar"],
} as const;
/** Express a supplied bond redemption premium or discount as both cash and percent of par. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { redemptionAmount, parAmount } = request;
  const compute = (): Output => {
    (H.domain(parAmount > 0, "parAmount"), parAmount);
    H.domain(redemptionAmount >= 0, "redemptionAmount");
    return {
      premiumAmount: redemptionAmount - parAmount,
      premiumPercentOfPar: (100 * (redemptionAmount - parAmount)) / parAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { redemptionAmount: 1050, parAmount: 1000 },
  output: { premiumAmount: 50, premiumPercentOfPar: 5 },
} satisfies ToolExample<Input, Output>;
export const bondRedemptionPremiumPerParTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/bond-redemption-premium-per-par",
    title: "Bond Redemption Premium Per PAR Tool",
    description:
      "Express a supplied bond redemption premium or discount as both cash and percent of par.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        redemptionAmount: { type: "number", minimum: 0 },
        parAmount: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["redemptionAmount", "parAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premiumAmount: { type: "number" },
        premiumPercentOfPar: { type: "number" },
      },
      required: ["premiumAmount", "premiumPercentOfPar"],
    },
    ports: {
      inputs: [
        {
          id: "redemptionAmount",
          label: "Redemption Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "parAmount",
          label: "Par Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "premiumAmount",
          label: "Premium Amount",
          valueType: { type: "number" },
        },
        {
          id: "premiumPercentOfPar",
          label: "Premium Percent Of Par",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bondRedemptionPremiumPerParTool.execute;
export default bondRedemptionPremiumPerParTool;
