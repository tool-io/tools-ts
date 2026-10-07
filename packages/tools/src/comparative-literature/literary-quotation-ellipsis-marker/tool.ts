import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prefix: string;
  readonly suffix: string;
  readonly editorialOmission: boolean;
};
export type Output = { readonly quotation: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: { type: "string", maxLength: 8192 },
    suffix: { type: "string", maxLength: 8192 },
    editorialOmission: { type: "boolean" },
  },
  required: ["prefix", "suffix", "editorialOmission"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quotation: { type: "string", maxLength: 8192 } },
  required: ["quotation"],
} as const;
/** Insert an explicitly editorial bracketed ellipsis or a source-style ellipsis between supplied quotation fragments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefix, suffix, editorialOmission } = request;
  const compute = (): Output => {
    return { quotation: prefix + (editorialOmission ? "[…]" : "…") + suffix };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prefix: "Opening ", suffix: " closing", editorialOmission: true },
  output: { quotation: "Opening […] closing" },
} satisfies ToolExample<Input, Output>;
export const literaryQuotationEllipsisMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/literary-quotation-ellipsis-marker",
    title: "Literary Quotation Ellipsis Marker",
    description:
      "Insert an explicitly editorial bracketed ellipsis or a source-style ellipsis between supplied quotation fragments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", maxLength: 8192 },
        suffix: { type: "string", maxLength: 8192 },
        editorialOmission: { type: "boolean" },
      },
      required: ["prefix", "suffix", "editorialOmission"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { quotation: { type: "string", maxLength: 8192 } },
      required: ["quotation"],
    },
    ports: {
      inputs: [
        {
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suffix",
          label: "Suffix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "editorialOmission",
          label: "Editorial Omission",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "quotation", label: "Quotation", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = literaryQuotationEllipsisMarkerTool.execute;
export default literaryQuotationEllipsisMarkerTool;
