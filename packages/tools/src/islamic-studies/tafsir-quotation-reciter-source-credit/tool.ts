import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotationId: string;
  readonly suppliedCreditName: string;
  readonly sourceLocator: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCreditName: { type: "string", maxLength: 8192, minLength: 1 },
    sourceLocator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["quotationId", "suppliedCreditName", "sourceLocator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit tafsir quotation source-credit metadata without identifying readings or evaluating interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotationId, suppliedCreditName, sourceLocator } = request;
  const compute = (): Output => {
    H.domain(quotationId.length > 0, "quotationId");
    H.domain(suppliedCreditName.length > 0, "suppliedCreditName");
    H.domain(sourceLocator.length > 0, "sourceLocator");
    return {
      token: JSON.stringify([quotationId, suppliedCreditName, sourceLocator]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quotationId: "Q17",
    suppliedCreditName: "Reader A",
    sourceLocator: "source S4",
  },
  output: { token: '["Q17","Reader A","source S4"]' },
} satisfies ToolExample<Input, Output>;
export const tafsirQuotationReciterSourceCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/tafsir-quotation-reciter-source-credit",
    title: "Tafsir Quotation Reciter Source Credit Tool",
    description:
      "Preserve explicit tafsir quotation source-credit metadata without identifying readings or evaluating interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotationId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCreditName: { type: "string", maxLength: 8192, minLength: 1 },
        sourceLocator: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["quotationId", "suppliedCreditName", "sourceLocator"],
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
          id: "quotationId",
          label: "Quotation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCreditName",
          label: "Supplied Credit Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceLocator",
          label: "Source Locator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = tafsirQuotationReciterSourceCreditTool.execute;
export default tafsirQuotationReciterSourceCreditTool;
