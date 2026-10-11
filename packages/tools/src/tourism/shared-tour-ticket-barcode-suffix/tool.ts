import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tourId: string;
  readonly suppliedBarcodeText: string;
  readonly suffix: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tourId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedBarcodeText: { type: "string", maxLength: 8192, minLength: 1 },
    suffix: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["tourId", "suppliedBarcodeText", "suffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit shared-tour ticket barcode text by suffix without generating or validating barcode symbols. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tourId, suppliedBarcodeText, suffix } = request;
  const compute = (): Output => {
    H.domain(tourId.length > 0, "tourId");
    H.domain(suppliedBarcodeText.length > 0, "suppliedBarcodeText");
    H.domain(suffix.length > 0, "suffix");
    return { token: JSON.stringify([tourId, suppliedBarcodeText, suffix]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tourId: "TOUR17", suppliedBarcodeText: "00042", suffix: "A" },
  output: { token: '["TOUR17","00042","A"]' },
} satisfies ToolExample<Input, Output>;
export const sharedTourTicketBarcodeSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["tourism", "business and finance"],
      keywords: ["tourism", "business and finance"],
    },
    id: "tourism/shared-tour-ticket-barcode-suffix",
    title: "Shared Tour Ticket Barcode Suffix",
    description:
      "Qualify an explicit shared-tour ticket barcode text by suffix without generating or validating barcode symbols.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tourId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedBarcodeText: { type: "string", maxLength: 8192, minLength: 1 },
        suffix: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["tourId", "suppliedBarcodeText", "suffix"],
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
          id: "tourId",
          label: "Tour Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedBarcodeText",
          label: "Supplied Barcode Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suffix",
          label: "Suffix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sharedTourTicketBarcodeSuffixTool.execute;
export default sharedTourTicketBarcodeSuffixTool;
