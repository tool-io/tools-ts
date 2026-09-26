import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentLengths: readonly number[];
  readonly referenceSegment: number;
};
export type Output = {
  readonly totalLength: number;
  readonly referenceFraction: number;
  readonly longestIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentLengths: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceSegment: { type: "integer", minimum: 0 },
  },
  required: ["segmentLengths", "referenceSegment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalLength: { type: "number" },
    referenceFraction: { type: "number" },
    longestIndex: { type: "integer" },
  },
  required: ["totalLength", "referenceFraction", "longestIndex"],
} as const;
/** Zero-based segment index; the first longest segment wins ties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentLengths, referenceSegment } = request;
  const compute = (): Output => {
    H.domain(segmentLengths.length > 0 && segmentLengths.every((x) => x > 0));
    H.integer(referenceSegment, 0, segmentLengths.length - 1);
    return {
      totalLength: segmentLengths.reduce((a, b) => a + b, 0),
      referenceFraction:
        segmentLengths[referenceSegment] /
        segmentLengths.reduce((a, b) => a + b, 0),
      longestIndex: segmentLengths.indexOf(Math.max(...segmentLengths)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segmentLengths: [2, 3, 5], referenceSegment: 1 },
  output: { totalLength: 10, referenceFraction: 0.3, longestIndex: 2 },
} satisfies ToolExample<Input, Output>;
export const insectAntennalSegmentLengthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-antennal-segment-length-ratio",
    title: "Insect Antennal Segment Length Ratio Tool",
    description:
      "Zero-based segment index; the first longest segment wins ties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceSegment: { type: "integer", minimum: 0 },
      },
      required: ["segmentLengths", "referenceSegment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalLength: { type: "number" },
        referenceFraction: { type: "number" },
        longestIndex: { type: "integer" },
      },
      required: ["totalLength", "referenceFraction", "longestIndex"],
    },
    ports: {
      inputs: [
        {
          id: "segmentLengths",
          label: "Segment Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceSegment",
          label: "Reference Segment",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalLength",
          label: "Total Length",
          valueType: { type: "number" },
        },
        {
          id: "referenceFraction",
          label: "Reference Fraction",
          valueType: { type: "number" },
        },
        {
          id: "longestIndex",
          label: "Longest Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectAntennalSegmentLengthRatioTool.execute;
export default insectAntennalSegmentLengthRatioTool;
