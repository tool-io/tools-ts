import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedStrokeWidth: number;
  readonly suppliedReferenceWidth: number;
};
export type Output = { readonly widthRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedStrokeWidth: { type: "number", minimum: 0 },
    suppliedReferenceWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedStrokeWidth", "suppliedReferenceWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { widthRatio: { type: "number" } },
  required: ["widthRatio"],
} as const;
/** Compare explicit brush-stroke width to a supplied positive reference without analyzing an image or identifying a brush. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedStrokeWidth, suppliedReferenceWidth } = request;
  const compute = (): Output => {
    H.domain(recordedStrokeWidth >= 0, "recordedStrokeWidth");
    (H.domain(
      Number.isFinite(suppliedReferenceWidth) && suppliedReferenceWidth > 0,
      "suppliedReferenceWidth",
    ),
      suppliedReferenceWidth);
    return { widthRatio: recordedStrokeWidth / suppliedReferenceWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedStrokeWidth: 6, suppliedReferenceWidth: 4 },
  output: { widthRatio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const brushMarkStrokeWidthRatioTool = H.defineSchemaCalculation<
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
    id: "visual-arts/brush-mark-stroke-width-ratio",
    title: "Brush Mark Stroke Width Ratio",
    description:
      "Compare explicit brush-stroke width to a supplied positive reference without analyzing an image or identifying a brush.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedStrokeWidth: { type: "number", minimum: 0 },
        suppliedReferenceWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedStrokeWidth", "suppliedReferenceWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { widthRatio: { type: "number" } },
      required: ["widthRatio"],
    },
    ports: {
      inputs: [
        {
          id: "recordedStrokeWidth",
          label: "Recorded Stroke Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceWidth",
          label: "Supplied Reference Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "widthRatio",
          label: "Width Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = brushMarkStrokeWidthRatioTool.execute;
export default brushMarkStrokeWidthRatioTool;
