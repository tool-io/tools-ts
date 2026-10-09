import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly benefitRecordId: string;
  readonly valuationYearText: string;
  readonly discountBaseYearText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    benefitRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    valuationYearText: { type: "string", maxLength: 8192, minLength: 1 },
    discountBaseYearText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["benefitRecordId", "valuationYearText", "discountBaseYearText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit habitat benefit valuation and discount base-year labels without discounting or forecasting benefits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { benefitRecordId, valuationYearText, discountBaseYearText } = request;
  const compute = (): Output => {
    H.domain(benefitRecordId.length > 0, "benefitRecordId");
    H.domain(valuationYearText.length > 0, "valuationYearText");
    H.domain(discountBaseYearText.length > 0, "discountBaseYearText");
    return {
      token: JSON.stringify([
        benefitRecordId,
        valuationYearText,
        discountBaseYearText,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    benefitRecordId: "B17",
    valuationYearText: "2030",
    discountBaseYearText: "2026",
  },
  output: { token: '["B17","2030","2026"]' },
} satisfies ToolExample<Input, Output>;
export const habitatBenefitDiscountYearLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/habitat-benefit-discount-year-label",
    title: "Habitat Benefit Discount Year Label Tool",
    description:
      "Preserve explicit habitat benefit valuation and discount base-year labels without discounting or forecasting benefits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        benefitRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        valuationYearText: { type: "string", maxLength: 8192, minLength: 1 },
        discountBaseYearText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "benefitRecordId",
        "valuationYearText",
        "discountBaseYearText",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "benefitRecordId",
          label: "Benefit Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "valuationYearText",
          label: "Valuation Year Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "discountBaseYearText",
          label: "Discount Base Year Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = habitatBenefitDiscountYearLabelTool.execute;
export default habitatBenefitDiscountYearLabelTool;
