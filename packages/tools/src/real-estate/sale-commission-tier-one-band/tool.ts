import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly salePrice: number;
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly rate: number;
};
export type Output = {
  readonly eligibleAmount: number;
  readonly commission: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    salePrice: { type: "number", minimum: 0 },
    lowerBound: { type: "number", minimum: 0 },
    upperBound: { type: "number" },
    rate: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["salePrice", "lowerBound", "upperBound", "rate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleAmount: { type: "number" },
    commission: { type: "number" },
  },
  required: ["eligibleAmount", "commission"],
} as const;
/** Calculate sale commission tier one band from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { salePrice, lowerBound, upperBound, rate } = request;
  const compute = (): Output => {
    H.domain(salePrice >= 0 && lowerBound >= 0 && upperBound >= lowerBound);
    H.probability(rate);
    return {
      eligibleAmount: Math.max(0, Math.min(salePrice, upperBound) - lowerBound),
      commission:
        Math.max(0, Math.min(salePrice, upperBound) - lowerBound) * rate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    salePrice: 150000,
    lowerBound: 100000,
    upperBound: 200000,
    rate: 0.02,
  },
  output: { eligibleAmount: 50000, commission: 1000 },
} satisfies ToolExample<Input, Output>;
export const saleCommissionTierOneBandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/sale-commission-tier-one-band",
    title: "Sale Commission Tier One Band Tool",
    description:
      "Calculate sale commission tier one band from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        salePrice: { type: "number", minimum: 0 },
        lowerBound: { type: "number", minimum: 0 },
        upperBound: { type: "number" },
        rate: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["salePrice", "lowerBound", "upperBound", "rate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleAmount: { type: "number" },
        commission: { type: "number" },
      },
      required: ["eligibleAmount", "commission"],
    },
    ports: {
      inputs: [
        {
          id: "salePrice",
          label: "Sale Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerBound",
          label: "Lower Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleAmount",
          label: "Eligible Amount",
          valueType: { type: "number" },
        },
        {
          id: "commission",
          label: "Commission",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = saleCommissionTierOneBandTool.execute;
export default saleCommissionTierOneBandTool;
