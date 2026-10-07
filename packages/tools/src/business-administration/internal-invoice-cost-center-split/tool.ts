import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceAmount: number;
  readonly allocatedFraction: number;
};
export type Output = {
  readonly allocatedAmount: number;
  readonly remainingAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceAmount: { type: "number" },
    allocatedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["invoiceAmount", "allocatedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedAmount: { type: "number" },
    remainingAmount: { type: "number" },
  },
  required: ["allocatedAmount", "remainingAmount"],
} as const;
/** Split a supplied signed internal invoice amount using an explicit cost-center allocation fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoiceAmount, allocatedFraction } = request;
  const compute = (): Output => {
    (H.domain(
      allocatedFraction >= 0 && allocatedFraction <= 1,
      "allocatedFraction",
    ),
      allocatedFraction);
    return {
      allocatedAmount: invoiceAmount * allocatedFraction,
      remainingAmount: invoiceAmount * (1 - allocatedFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { invoiceAmount: 400, allocatedFraction: 0.25 },
  output: { allocatedAmount: 100, remainingAmount: 300 },
} satisfies ToolExample<Input, Output>;
export const internalInvoiceCostCenterSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/internal-invoice-cost-center-split",
    title: "Internal Invoice Cost Center Split",
    description:
      "Split a supplied signed internal invoice amount using an explicit cost-center allocation fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invoiceAmount: { type: "number" },
        allocatedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["invoiceAmount", "allocatedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedAmount: { type: "number" },
        remainingAmount: { type: "number" },
      },
      required: ["allocatedAmount", "remainingAmount"],
    },
    ports: {
      inputs: [
        {
          id: "invoiceAmount",
          label: "Invoice Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedFraction",
          label: "Allocated Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedAmount",
          label: "Allocated Amount",
          valueType: { type: "number" },
        },
        {
          id: "remainingAmount",
          label: "Remaining Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = internalInvoiceCostCenterSplitTool.execute;
export default internalInvoiceCostCenterSplitTool;
