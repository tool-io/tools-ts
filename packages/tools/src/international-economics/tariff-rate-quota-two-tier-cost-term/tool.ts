import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly quotaRemaining: number;
  readonly inQuotaRate: number;
  readonly outQuotaRate: number;
  readonly customsValuePerUnit: number;
};
export type Output = {
  readonly inQuotaQuantity: number;
  readonly outQuotaQuantity: number;
  readonly duty: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    quotaRemaining: { type: "number", minimum: 0 },
    inQuotaRate: { type: "number", minimum: 0 },
    outQuotaRate: { type: "number", minimum: 0 },
    customsValuePerUnit: { type: "number", minimum: 0 },
  },
  required: [
    "quantity",
    "quotaRemaining",
    "inQuotaRate",
    "outQuotaRate",
    "customsValuePerUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inQuotaQuantity: { type: "number" },
    outQuotaQuantity: { type: "number" },
    duty: { type: "number" },
  },
  required: ["inQuotaQuantity", "outQuotaQuantity", "duty"],
} as const;
/** One supplied tariff-rate-quota slice without quota allocation, origin or customs policy lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    quantity,
    quotaRemaining,
    inQuotaRate,
    outQuotaRate,
    customsValuePerUnit,
  } = request;
  const compute = (): Output => {
    H.domain(
      quantity >= 0 &&
        quotaRemaining >= 0 &&
        inQuotaRate >= 0 &&
        outQuotaRate >= 0 &&
        customsValuePerUnit >= 0,
    );
    return {
      inQuotaQuantity: Math.min(quantity, quotaRemaining),
      outQuotaQuantity: Math.max(0, quantity - quotaRemaining),
      duty:
        customsValuePerUnit *
        (Math.min(quantity, quotaRemaining) * inQuotaRate +
          Math.max(0, quantity - quotaRemaining) * outQuotaRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quantity: 150,
    quotaRemaining: 100,
    inQuotaRate: 0.05,
    outQuotaRate: 0.2,
    customsValuePerUnit: 10,
  },
  output: { inQuotaQuantity: 100, outQuotaQuantity: 50, duty: 150 },
} satisfies ToolExample<Input, Output>;
export const tariffRateQuotaTwoTierCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/tariff-rate-quota-two-tier-cost-term",
    title: "Tariff Rate Quota Two Tier Cost Term Tool",
    description:
      "One supplied tariff-rate-quota slice without quota allocation, origin or customs policy lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        quotaRemaining: { type: "number", minimum: 0 },
        inQuotaRate: { type: "number", minimum: 0 },
        outQuotaRate: { type: "number", minimum: 0 },
        customsValuePerUnit: { type: "number", minimum: 0 },
      },
      required: [
        "quantity",
        "quotaRemaining",
        "inQuotaRate",
        "outQuotaRate",
        "customsValuePerUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inQuotaQuantity: { type: "number" },
        outQuotaQuantity: { type: "number" },
        duty: { type: "number" },
      },
      required: ["inQuotaQuantity", "outQuotaQuantity", "duty"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quotaRemaining",
          label: "Quota Remaining",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inQuotaRate",
          label: "In Quota Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outQuotaRate",
          label: "Out Quota Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "customsValuePerUnit",
          label: "Customs Value Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "inQuotaQuantity",
          label: "In Quota Quantity",
          valueType: { type: "number" },
        },
        {
          id: "outQuotaQuantity",
          label: "Out Quota Quantity",
          valueType: { type: "number" },
        },
        { id: "duty", label: "Duty", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tariffRateQuotaTwoTierCostTermTool.execute;
export default tariffRateQuotaTwoTierCostTermTool;
