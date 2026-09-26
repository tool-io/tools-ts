import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goodsValue: number;
  readonly freight: number;
  readonly rate: number;
  readonly includeFreight: boolean;
};
export type Output = { readonly insuredBase: number; readonly premium: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goodsValue: { type: "number", minimum: 0 },
    freight: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
    includeFreight: { type: "boolean" },
  },
  required: ["goodsValue", "freight", "rate", "includeFreight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { insuredBase: { type: "number" }, premium: { type: "number" } },
  required: ["insuredBase", "premium"],
} as const;
/** Calculate historical shipping insurance premium term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goodsValue, freight, rate, includeFreight } = request;
  const compute = (): Output => {
    H.domain(goodsValue >= 0 && freight >= 0 && rate >= 0);
    return {
      insuredBase: goodsValue + (includeFreight ? freight : 0),
      premium: (goodsValue + (includeFreight ? freight : 0)) * rate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { goodsValue: 1000, freight: 200, rate: 0.05, includeFreight: true },
  output: { insuredBase: 1200, premium: 60 },
} satisfies ToolExample<Input, Output>;
export const historicalShippingInsurancePremiumTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economic-history/historical-shipping-insurance-premium-term",
      title: "Historical Shipping Insurance Premium Term Tool",
      description:
        "Calculate historical shipping insurance premium term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          goodsValue: { type: "number", minimum: 0 },
          freight: { type: "number", minimum: 0 },
          rate: { type: "number", minimum: 0 },
          includeFreight: { type: "boolean" },
        },
        required: ["goodsValue", "freight", "rate", "includeFreight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          insuredBase: { type: "number" },
          premium: { type: "number" },
        },
        required: ["insuredBase", "premium"],
      },
      ports: {
        inputs: [
          {
            id: "goodsValue",
            label: "Goods Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "freight",
            label: "Freight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rate",
            label: "Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeFreight",
            label: "Include Freight",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "insuredBase",
            label: "Insured Base",
            valueType: { type: "number" },
          },
          { id: "premium", label: "Premium", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = historicalShippingInsurancePremiumTermTool.execute;
export default historicalShippingInsurancePremiumTermTool;
