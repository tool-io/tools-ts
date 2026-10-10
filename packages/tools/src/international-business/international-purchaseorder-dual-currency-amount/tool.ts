import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceAmount: number;
  readonly targetUnitsPerSourceUnit: number;
};
export type Output = { readonly targetAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceAmount: { type: "number" },
    targetUnitsPerSourceUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceAmount", "targetUnitsPerSourceUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetAmount: { type: "number" } },
  required: ["targetAmount"],
} as const;
/** Convert one signed purchase-order amount using an explicitly supplied positive target-currency-per-source-currency rate without rate lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceAmount, targetUnitsPerSourceUnit } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(targetUnitsPerSourceUnit) && targetUnitsPerSourceUnit > 0,
      "targetUnitsPerSourceUnit",
    ),
      targetUnitsPerSourceUnit);
    return { targetAmount: sourceAmount * targetUnitsPerSourceUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceAmount: 1000, targetUnitsPerSourceUnit: 1.2 },
  output: { targetAmount: 1200 },
} satisfies ToolExample<Input, Output>;
export const internationalPurchaseorderDualCurrencyAmountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/international-purchaseorder-dual-currency-amount",
      title: "International Purchaseorder Dual Currency Amount Tool",
      description:
        "Convert one signed purchase-order amount using an explicitly supplied positive target-currency-per-source-currency rate without rate lookup.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceAmount: { type: "number" },
          targetUnitsPerSourceUnit: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["sourceAmount", "targetUnitsPerSourceUnit"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { targetAmount: { type: "number" } },
        required: ["targetAmount"],
      },
      ports: {
        inputs: [
          {
            id: "sourceAmount",
            label: "Source Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetUnitsPerSourceUnit",
            label: "Target Units Per Source Unit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "targetAmount",
            label: "Target Amount",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = internationalPurchaseorderDualCurrencyAmountTool.execute;
export default internationalPurchaseorderDualCurrencyAmountTool;
