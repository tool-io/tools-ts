import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotation: string;
  readonly edition: string;
  readonly locator: string;
};
export type Output = { readonly credit: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotation: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
    locator: { type: "string", maxLength: 8192 },
  },
  required: ["quotation", "edition", "locator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { credit: { type: "string", maxLength: 8192 } },
  required: ["credit"],
} as const;
/** Format literal scripture quotation and supplied edition/locator attribution without verifying text or interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotation, edition, locator } = request;
  const compute = (): Output => {
    H.domain(
      quotation.length > 0 && edition.length > 0 && locator.length > 0,
      "quotation",
    );
    return {
      credit: JSON.stringify(quotation) + " — " + edition + ", " + locator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quotation: "A short phrase", edition: "Edition A", locator: "3:16" },
  output: { credit: '"A short phrase" — Edition A, 3:16' },
} satisfies ToolExample<Input, Output>;
export const scriptureQuotationSourceCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/scripture-quotation-source-credit",
    title: "Scripture Quotation Source Credit Tool",
    description:
      "Format literal scripture quotation and supplied edition/locator attribution without verifying text or interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotation: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
        locator: { type: "string", maxLength: 8192 },
      },
      required: ["quotation", "edition", "locator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { credit: { type: "string", maxLength: 8192 } },
      required: ["credit"],
    },
    ports: {
      inputs: [
        {
          id: "quotation",
          label: "Quotation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "locator",
          label: "Locator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "credit", label: "Credit", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = scriptureQuotationSourceCreditTool.execute;
export default scriptureQuotationSourceCreditTool;
