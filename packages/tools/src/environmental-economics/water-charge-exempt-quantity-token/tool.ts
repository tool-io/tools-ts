import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly withdrawal: number;
  readonly exemptQuantity: number;
  readonly suppliedRate: number;
  readonly applyExemption: boolean;
};
export type Output = { readonly chargeable: number; readonly amount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withdrawal: { type: "number", minimum: 0 },
    exemptQuantity: { type: "number", minimum: 0 },
    suppliedRate: { type: "number", minimum: 0 },
    applyExemption: { type: "boolean" },
  },
  required: ["withdrawal", "exemptQuantity", "suppliedRate", "applyExemption"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chargeable: { type: "number" }, amount: { type: "number" } },
  required: ["chargeable", "amount"],
} as const;
/** Calculate water charge exempt quantity token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { withdrawal, exemptQuantity, suppliedRate, applyExemption } = request;
  const compute = (): Output => {
    H.domain(withdrawal >= 0 && exemptQuantity >= 0 && suppliedRate >= 0);
    return {
      chargeable: Math.max(
        0,
        withdrawal - (applyExemption ? exemptQuantity : 0),
      ),
      amount:
        Math.max(0, withdrawal - (applyExemption ? exemptQuantity : 0)) *
        suppliedRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    withdrawal: 100,
    exemptQuantity: 20,
    suppliedRate: 2,
    applyExemption: true,
  },
  output: { chargeable: 80, amount: 160 },
} satisfies ToolExample<Input, Output>;
export const waterChargeExemptQuantityTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/water-charge-exempt-quantity-token",
    title: "Water Charge Exempt Quantity Token Tool",
    description:
      "Calculate water charge exempt quantity token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withdrawal: { type: "number", minimum: 0 },
        exemptQuantity: { type: "number", minimum: 0 },
        suppliedRate: { type: "number", minimum: 0 },
        applyExemption: { type: "boolean" },
      },
      required: [
        "withdrawal",
        "exemptQuantity",
        "suppliedRate",
        "applyExemption",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chargeable: { type: "number" },
        amount: { type: "number" },
      },
      required: ["chargeable", "amount"],
    },
    ports: {
      inputs: [
        {
          id: "withdrawal",
          label: "Withdrawal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exemptQuantity",
          label: "Exempt Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRate",
          label: "Supplied Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "applyExemption",
          label: "Apply Exemption",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "chargeable",
          label: "Chargeable",
          valueType: { type: "number" },
        },
        { id: "amount", label: "Amount", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = waterChargeExemptQuantityTokenTool.execute;
export default waterChargeExemptQuantityTokenTool;
