import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly netRetention: number;
  readonly taxRate: number;
  readonly taxOnRelease: boolean;
};
export type Output = { readonly tax: number; readonly releaseGross: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netRetention: { type: "number", minimum: 0 },
    taxRate: { type: "number", minimum: 0 },
    taxOnRelease: { type: "boolean" },
  },
  required: ["netRetention", "taxRate", "taxOnRelease"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tax: { type: "number" }, releaseGross: { type: "number" } },
  required: ["tax", "releaseGross"],
} as const;
/** Apply the caller-selected tax-on-release treatment without inferring a tax jurisdiction or invoice rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { netRetention, taxRate, taxOnRelease } = request;
  const compute = (): Output => {
    H.domain(netRetention >= 0 && taxRate >= 0);
    const tax = taxOnRelease ? netRetention * taxRate : 0;
    return { tax, releaseGross: netRetention + tax };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { netRetention: 500, taxRate: 0.2, taxOnRelease: true },
  output: { tax: 100, releaseGross: 600 },
} satisfies ToolExample<Input, Output>;
export const invoiceRetentionReleaseTaxBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/invoice-retention-release-tax-basis",
    title: "Invoice Retention Release Tax Basis Tool",
    description:
      "Apply the caller-selected tax-on-release treatment without inferring a tax jurisdiction or invoice rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netRetention: { type: "number", minimum: 0 },
        taxRate: { type: "number", minimum: 0 },
        taxOnRelease: { type: "boolean" },
      },
      required: ["netRetention", "taxRate", "taxOnRelease"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tax: { type: "number" }, releaseGross: { type: "number" } },
      required: ["tax", "releaseGross"],
    },
    ports: {
      inputs: [
        {
          id: "netRetention",
          label: "Net Retention",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxRate",
          label: "Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxOnRelease",
          label: "Tax On Release",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "tax", label: "Tax", valueType: { type: "number" } },
        {
          id: "releaseGross",
          label: "Release Gross",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = invoiceRetentionReleaseTaxBasisTool.execute;
export default invoiceRetentionReleaseTaxBasisTool;
