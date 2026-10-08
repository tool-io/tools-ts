import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly width: number };
export type Output = {
  readonly rectangularAreaEstimate: number;
  readonly aspectRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    width: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["length", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rectangularAreaEstimate: { type: "number" },
    aspectRatio: { type: "number" },
  },
  required: ["rectangularAreaEstimate", "aspectRatio"],
} as const;
/** Describe an explicit wound length/width pair by bounding-rectangle area and ratio without estimating true wound area or clinical severity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, width } = request;
  const compute = (): Output => {
    H.domain(length >= 0, "length");
    (H.domain(width > 0, "width"), width);
    return {
      rectangularAreaEstimate: length * width,
      aspectRatio: length / width,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 4, width: 2 },
  output: { rectangularAreaEstimate: 8, aspectRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const woundLengthWidthMeasurementPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dermatology", "health and medicine"],
      keywords: ["dermatology", "health and medicine"],
    },
    id: "dermatology/wound-length-width-measurement-pair",
    title: "Wound Length Width Measurement Pair",
    description:
      "Describe an explicit wound length/width pair by bounding-rectangle area and ratio without estimating true wound area or clinical severity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        width: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["length", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rectangularAreaEstimate: { type: "number" },
        aspectRatio: { type: "number" },
      },
      required: ["rectangularAreaEstimate", "aspectRatio"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rectangularAreaEstimate",
          label: "Rectangular Area Estimate",
          valueType: { type: "number" },
        },
        {
          id: "aspectRatio",
          label: "Aspect Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = woundLengthWidthMeasurementPairTool.execute;
export default woundLengthWidthMeasurementPairTool;
