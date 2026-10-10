import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shipmentId: string;
  readonly documentType: string;
  readonly documentId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shipmentId: { type: "string", maxLength: 8192, minLength: 1 },
    documentType: { type: "string", maxLength: 8192, minLength: 1 },
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["shipmentId", "documentType", "documentId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate an explicitly identified shipment document with its shipment without validating trade-document sufficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shipmentId, documentType, documentId } = request;
  const compute = (): Output => {
    H.domain(shipmentId.length > 0, "shipmentId");
    H.domain(documentType.length > 0, "documentType");
    H.domain(documentId.length > 0, "documentId");
    return { token: JSON.stringify([shipmentId, documentType, documentId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shipmentId: "SHIP17", documentType: "invoice", documentId: "INV3" },
  output: { token: '["SHIP17","invoice","INV3"]' },
} satisfies ToolExample<Input, Output>;
export const shipmentDocumentReferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-business",
        "international business",
        "business and finance",
      ],
      keywords: ["international business", "business and finance"],
    },
    id: "international-business/shipment-document-reference-token",
    title: "Shipment Document Reference Token",
    description:
      "Associate an explicitly identified shipment document with its shipment without validating trade-document sufficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shipmentId: { type: "string", maxLength: 8192, minLength: 1 },
        documentType: { type: "string", maxLength: 8192, minLength: 1 },
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["shipmentId", "documentType", "documentId"],
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
          id: "shipmentId",
          label: "Shipment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "documentType",
          label: "Document Type",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = shipmentDocumentReferenceTokenTool.execute;
export default shipmentDocumentReferenceTokenTool;
