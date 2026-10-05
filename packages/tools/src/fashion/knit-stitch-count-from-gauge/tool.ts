import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly widthCentimeters: number;
  readonly stitchesPerTenCentimeters: number;
};
export type Output = {
  readonly rawStitchCount: number;
  readonly roundedStitchCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    widthCentimeters: { type: "number", minimum: 0 },
    stitchesPerTenCentimeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["widthCentimeters", "stitchesPerTenCentimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawStitchCount: { type: "number" },
    roundedStitchCount: { type: "integer" },
  },
  required: ["rawStitchCount", "roundedStitchCount"],
} as const;
/** Convert measured knitting gauge to a stitch count, returning both raw and nearest integer counts with half stitches rounded upward. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { widthCentimeters, stitchesPerTenCentimeters } = request;
  const compute = (): Output => {
    H.domain(widthCentimeters >= 0, "widthCentimeters");
    (H.domain(stitchesPerTenCentimeters > 0, "stitchesPerTenCentimeters"),
      stitchesPerTenCentimeters);
    return {
      rawStitchCount: (widthCentimeters * stitchesPerTenCentimeters) / 10,
      roundedStitchCount: Math.round(
        (widthCentimeters * stitchesPerTenCentimeters) / 10,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { widthCentimeters: 23, stitchesPerTenCentimeters: 20 },
  output: { rawStitchCount: 46, roundedStitchCount: 46 },
} satisfies ToolExample<Input, Output>;
export const knitStitchCountFromGaugeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/knit-stitch-count-from-gauge",
    title: "Knit Stitch Count From Gauge Tool",
    description:
      "Convert measured knitting gauge to a stitch count, returning both raw and nearest integer counts with half stitches rounded upward.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        widthCentimeters: { type: "number", minimum: 0 },
        stitchesPerTenCentimeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["widthCentimeters", "stitchesPerTenCentimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawStitchCount: { type: "number" },
        roundedStitchCount: { type: "integer" },
      },
      required: ["rawStitchCount", "roundedStitchCount"],
    },
    ports: {
      inputs: [
        {
          id: "widthCentimeters",
          label: "Width Centimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stitchesPerTenCentimeters",
          label: "Stitches Per Ten Centimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawStitchCount",
          label: "Raw Stitch Count",
          valueType: { type: "number" },
        },
        {
          id: "roundedStitchCount",
          label: "Rounded Stitch Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = knitStitchCountFromGaugeTool.execute;
export default knitStitchCountFromGaugeTool;
