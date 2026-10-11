import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly paperWidth: number;
  readonly imageWidth: number;
  readonly reservedDeckleEachSide: number;
};
export type Output = { readonly remainingMarginEachSide: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    paperWidth: { type: "number", minimum: 0 },
    imageWidth: { type: "number", minimum: 0 },
    reservedDeckleEachSide: { type: "number", minimum: 0 },
  },
  required: ["paperWidth", "imageWidth", "reservedDeckleEachSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingMarginEachSide: { type: "number" } },
  required: ["remainingMarginEachSide"],
} as const;
/** Subtract explicit image width and equal reserved deckle margins from paper width without recommending print layout. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { paperWidth, imageWidth, reservedDeckleEachSide } = request;
  const compute = (): Output => {
    H.domain(
      paperWidth >= 0 && imageWidth >= 0 && reservedDeckleEachSide >= 0,
      "paperWidth",
    );
    return {
      remainingMarginEachSide:
        (paperWidth - imageWidth) / 2 - reservedDeckleEachSide,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { paperWidth: 40, imageWidth: 30, reservedDeckleEachSide: 2 },
  output: { remainingMarginEachSide: 3 },
} satisfies ToolExample<Input, Output>;
export const artPrintPaperDeckleMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["visual-arts", "visual arts", "arts and design"],
      keywords: ["visual arts", "arts and design"],
    },
    id: "visual-arts/art-print-paper-deckle-margin",
    title: "Art Print Paper Deckle Margin",
    description:
      "Subtract explicit image width and equal reserved deckle margins from paper width without recommending print layout.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        paperWidth: { type: "number", minimum: 0 },
        imageWidth: { type: "number", minimum: 0 },
        reservedDeckleEachSide: { type: "number", minimum: 0 },
      },
      required: ["paperWidth", "imageWidth", "reservedDeckleEachSide"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingMarginEachSide: { type: "number" } },
      required: ["remainingMarginEachSide"],
    },
    ports: {
      inputs: [
        {
          id: "paperWidth",
          label: "Paper Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imageWidth",
          label: "Image Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedDeckleEachSide",
          label: "Reserved Deckle Each Side",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingMarginEachSide",
          label: "Remaining Margin Each Side",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artPrintPaperDeckleMarginTool.execute;
export default artPrintPaperDeckleMarginTool;
