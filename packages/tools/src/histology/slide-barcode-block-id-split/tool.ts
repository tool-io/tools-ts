import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly barcode: string; readonly delimiter: string };
export type Output = { readonly blockId: string; readonly slideId: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    barcode: { type: "string", maxLength: 8192 },
    delimiter: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["barcode", "delimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockId: { type: "string", maxLength: 8192 },
    slideId: { type: "string", maxLength: 8192 },
  },
  required: ["blockId", "slideId"],
} as const;
/** Split a supplied slide barcode at its final explicit delimiter without inferring a laboratory barcode standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { barcode, delimiter } = request;
  const compute = (): Output => {
    H.domain(delimiter.length > 0, "delimiter");
    const index = barcode.lastIndexOf(delimiter);
    H.domain(index > 0 && index + delimiter.length < barcode.length, "barcode");
    return {
      blockId: barcode.slice(0, index),
      slideId: barcode.slice(index + delimiter.length),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { barcode: "BLOCK-A/SL3", delimiter: "/" },
  output: { blockId: "BLOCK-A", slideId: "SL3" },
} satisfies ToolExample<Input, Output>;
export const slideBarcodeBlockIdSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["histology", "biology"],
      keywords: ["histology", "biology"],
    },
    id: "histology/slide-barcode-block-id-split",
    title: "Slide Barcode Block ID Split",
    description:
      "Split a supplied slide barcode at its final explicit delimiter without inferring a laboratory barcode standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        barcode: { type: "string", maxLength: 8192 },
        delimiter: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["barcode", "delimiter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockId: { type: "string", maxLength: 8192 },
        slideId: { type: "string", maxLength: 8192 },
      },
      required: ["blockId", "slideId"],
    },
    ports: {
      inputs: [
        {
          id: "barcode",
          label: "Barcode",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delimiter",
          label: "Delimiter",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "blockId", label: "Block Id", valueType: { type: "string" } },
        { id: "slideId", label: "Slide Id", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = slideBarcodeBlockIdSplitTool.execute;
export default slideBarcodeBlockIdSplitTool;
