import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly exemptQuantity: number;
  readonly rate: number;
  readonly exemptionApplied: boolean;
};
export type Output = { readonly chargeable: number; readonly fee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    exemptQuantity: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
    exemptionApplied: { type: "boolean" },
  },
  required: ["quantity", "exemptQuantity", "rate", "exemptionApplied"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chargeable: { type: "number" }, fee: { type: "number" } },
  required: ["chargeable", "fee"],
} as const;
/** Calculate public fee exempt base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, exemptQuantity, rate, exemptionApplied } = request;
  const compute = (): Output => {
    H.domain(
      quantity >= 0 &&
        exemptQuantity >= 0 &&
        exemptQuantity <= quantity &&
        rate >= 0,
    );
    return {
      chargeable: quantity - (exemptionApplied ? exemptQuantity : 0),
      fee: (quantity - (exemptionApplied ? exemptQuantity : 0)) * rate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 100, exemptQuantity: 20, rate: 2, exemptionApplied: true },
  output: { chargeable: 80, fee: 160 },
} satisfies ToolExample<Input, Output>;
export const publicFeeExemptBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/public-fee-exempt-base-flag",
    title: "Public Fee Exempt Base Flag Tool",
    description:
      "Calculate public fee exempt base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        exemptQuantity: { type: "number", minimum: 0 },
        rate: { type: "number", minimum: 0 },
        exemptionApplied: { type: "boolean" },
      },
      required: ["quantity", "exemptQuantity", "rate", "exemptionApplied"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { chargeable: { type: "number" }, fee: { type: "number" } },
      required: ["chargeable", "fee"],
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
          id: "exemptQuantity",
          label: "Exempt Quantity",
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
          id: "exemptionApplied",
          label: "Exemption Applied",
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
        { id: "fee", label: "Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = publicFeeExemptBaseFlagTool.execute;
export default publicFeeExemptBaseFlagTool;
