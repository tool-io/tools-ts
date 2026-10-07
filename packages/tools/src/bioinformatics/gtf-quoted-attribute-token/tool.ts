import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attributeName: string;
  readonly valueText: string;
};
export type Output = { readonly attributeToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attributeName: { type: "string", maxLength: 8192 },
    valueText: { type: "string", maxLength: 8192 },
  },
  required: ["attributeName", "valueText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { attributeToken: { type: "string", maxLength: 8192 } },
  required: ["attributeToken"],
} as const;
/** Format a single GTF name and quoted attribute value, rejecting quote, backslash and line-control characters instead of inventing an escape dialect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attributeName, valueText } = request;
  const compute = (): Output => {
    H.domain(
      /^[A-Za-z_][A-Za-z0-9_]*(?![\s\S])/.test(attributeName),
      "attributeName",
    );
    H.domain(!/["\\\x00-\x1f\x7f]/.test(valueText), "valueText");
    const quote = String.fromCharCode(34);
    return {
      attributeToken: attributeName + " " + quote + valueText + quote + ";",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attributeName: "gene_id", valueText: "GENE17" },
  output: { attributeToken: 'gene_id "GENE17";' },
} satisfies ToolExample<Input, Output>;
export const gtfQuotedAttributeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioinformatics", "biology"],
      keywords: ["bioinformatics", "biology"],
    },
    id: "bioinformatics/gtf-quoted-attribute-token",
    title: "GTF Quoted Attribute Token",
    description:
      "Format a single GTF name and quoted attribute value, rejecting quote, backslash and line-control characters instead of inventing an escape dialect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attributeName: { type: "string", maxLength: 8192 },
        valueText: { type: "string", maxLength: 8192 },
      },
      required: ["attributeName", "valueText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { attributeToken: { type: "string", maxLength: 8192 } },
      required: ["attributeToken"],
    },
    ports: {
      inputs: [
        {
          id: "attributeName",
          label: "Attribute Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "valueText",
          label: "Value Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "attributeToken",
          label: "Attribute Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = gtfQuotedAttributeTokenTool.execute;
export default gtfQuotedAttributeTokenTool;
