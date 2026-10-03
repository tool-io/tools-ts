import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerSpacing: number;
  readonly sliceThickness: number;
  readonly slices: number;
};
export type Output = {
  readonly intersliceGap: number;
  readonly centerSpan: number;
  readonly footprintSpan: number;
  readonly overlapping: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerSpacing: { type: "number", minimum: 0 },
    sliceThickness: { type: "number", minimum: 0 },
    slices: { type: "integer", minimum: 1 },
  },
  required: ["centerSpacing", "sliceThickness", "slices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersliceGap: { type: "number" },
    centerSpan: { type: "number" },
    footprintSpan: { type: "number" },
    overlapping: { type: "boolean" },
  },
  required: ["intersliceGap", "centerSpan", "footprintSpan", "overlapping"],
} as const;
/** Positive spacing magnitude versus slice thickness for parallel uniformly spaced slices; signed DICOM ordering and nonparallel geometry are outside this model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerSpacing, sliceThickness, slices } = request;
  const compute = (): Output => {
    H.domain(centerSpacing >= 0 && sliceThickness >= 0);
    H.integer(slices, 1);
    return {
      intersliceGap: centerSpacing - sliceThickness,
      centerSpan: (slices - 1) * centerSpacing,
      footprintSpan: (slices - 1) * centerSpacing + sliceThickness,
      overlapping: centerSpacing < sliceThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerSpacing: 5, sliceThickness: 3, slices: 10 },
  output: {
    intersliceGap: 2,
    centerSpan: 45,
    footprintSpan: 48,
    overlapping: false,
  },
} satisfies ToolExample<Input, Output>;
export const dicomSpacingBetweenSlicesThicknessGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "radiology/dicom-spacing-between-slices-thickness-gap",
      title: "DICOM Spacing Between Slices Thickness Gap Tool",
      description:
        "Positive spacing magnitude versus slice thickness for parallel uniformly spaced slices; signed DICOM ordering and nonparallel geometry are outside this model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          centerSpacing: { type: "number", minimum: 0 },
          sliceThickness: { type: "number", minimum: 0 },
          slices: { type: "integer", minimum: 1 },
        },
        required: ["centerSpacing", "sliceThickness", "slices"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intersliceGap: { type: "number" },
          centerSpan: { type: "number" },
          footprintSpan: { type: "number" },
          overlapping: { type: "boolean" },
        },
        required: [
          "intersliceGap",
          "centerSpan",
          "footprintSpan",
          "overlapping",
        ],
      },
      ports: {
        inputs: [
          {
            id: "centerSpacing",
            label: "Center Spacing",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sliceThickness",
            label: "Slice Thickness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "slices",
            label: "Slices",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "intersliceGap",
            label: "Interslice Gap",
            valueType: { type: "number" },
          },
          {
            id: "centerSpan",
            label: "Center Span",
            valueType: { type: "number" },
          },
          {
            id: "footprintSpan",
            label: "Footprint Span",
            valueType: { type: "number" },
          },
          {
            id: "overlapping",
            label: "Overlapping",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dicomSpacingBetweenSlicesThicknessGapTool.execute;
export default dicomSpacingBetweenSlicesThicknessGapTool;
