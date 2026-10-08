import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly faceValue: number;
  readonly issueProceeds: number;
};
export type Output = {
  readonly discountAmount: number;
  readonly discountPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    faceValue: { type: "number", exclusiveMinimum: 0 },
    issueProceeds: { type: "number", minimum: 0 },
  },
  required: ["faceValue", "issueProceeds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountAmount: { type: "number" },
    discountPercent: { type: "number" },
  },
  required: ["discountAmount", "discountPercent"],
} as const;
/** Calculate supplied face-minus-proceeds original discount and percent of face, preserving negative premiums without tax classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { faceValue, issueProceeds } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(faceValue) && faceValue > 0, "faceValue"),
      faceValue);
    H.domain(issueProceeds >= 0, "issueProceeds");
    return {
      discountAmount: faceValue - issueProceeds,
      discountPercent: ((faceValue - issueProceeds) / faceValue) * 100,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { faceValue: 1000, issueProceeds: 980 },
  output: { discountAmount: 20, discountPercent: 2 },
} satisfies ToolExample<Input, Output>;
export const debtIssuanceOriginalDiscountPercentageTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "trading"],
        fields: [
          "corporate-finance",
          "corporate finance",
          "business and finance",
        ],
        keywords: ["corporate finance", "business and finance"],
      },
      id: "corporate-finance/debt-issuance-original-discount-percentage",
      title: "Debt Issuance Original Discount Percentage",
      description:
        "Calculate supplied face-minus-proceeds original discount and percent of face, preserving negative premiums without tax classification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          faceValue: { type: "number", exclusiveMinimum: 0 },
          issueProceeds: { type: "number", minimum: 0 },
        },
        required: ["faceValue", "issueProceeds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          discountAmount: { type: "number" },
          discountPercent: { type: "number" },
        },
        required: ["discountAmount", "discountPercent"],
      },
      ports: {
        inputs: [
          {
            id: "faceValue",
            label: "Face Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "issueProceeds",
            label: "Issue Proceeds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "discountAmount",
            label: "Discount Amount",
            valueType: { type: "number" },
          },
          {
            id: "discountPercent",
            label: "Discount Percent",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = debtIssuanceOriginalDiscountPercentageTool.execute;
export default debtIssuanceOriginalDiscountPercentageTool;
