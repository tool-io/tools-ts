import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly sectionCode: string;
  readonly paragraph: number;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    sectionCode: { type: "string", maxLength: 8192, minLength: 1 },
    paragraph: { type: "integer", minimum: 1 },
  },
  required: ["documentId", "sectionCode", "paragraph"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an explicit document/section/paragraph locator without resolving document content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, sectionCode, paragraph } = request;
  const compute = (): Output => {
    H.domain(documentId.length > 0 && sectionCode.length > 0, "documentId");
    (H.domain(
      Number.isSafeInteger(paragraph) &&
        paragraph >= 1 &&
        paragraph <= Number.MAX_SAFE_INTEGER,
      "paragraph",
    ),
      paragraph);
    return { token: JSON.stringify([documentId, sectionCode, paragraph]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentId: "D17", sectionCode: "S3", paragraph: 4 },
  output: { token: '["D17","S3",4]' },
} satisfies ToolExample<Input, Output>;
export const publicTextPositionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/public-text-position-code",
    title: "Public Text Position Code",
    description:
      "Encode an explicit document/section/paragraph locator without resolving document content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        sectionCode: { type: "string", maxLength: 8192, minLength: 1 },
        paragraph: { type: "integer", minimum: 1 },
      },
      required: ["documentId", "sectionCode", "paragraph"],
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
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sectionCode",
          label: "Section Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "paragraph",
          label: "Paragraph",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicTextPositionCodeTool.execute;
export default publicTextPositionCodeTool;
