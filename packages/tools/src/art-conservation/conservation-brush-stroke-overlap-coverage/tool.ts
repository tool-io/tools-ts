import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly strokeWidth: number;
  readonly overlapFraction: number;
  readonly strokes: number;
  readonly length: number;
};
export type Output = {
  readonly coveredWidth: number;
  readonly coveredArea: number;
  readonly excessPaintedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strokeWidth: { type: "number", minimum: 0 },
    overlapFraction: { type: "number", minimum: 0, maximum: 1 },
    strokes: { type: "integer", minimum: 0 },
    length: { type: "number", minimum: 0 },
  },
  required: ["strokeWidth", "overlapFraction", "strokes", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredWidth: { type: "number" },
    coveredArea: { type: "number" },
    excessPaintedArea: { type: "number" },
  },
  required: ["coveredWidth", "coveredArea", "excessPaintedArea"],
} as const;
/** Parallel equal-width straight strokes with a fixed adjacent overlap and no change in stroke length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strokeWidth, overlapFraction, strokes, length } = request;
  const compute = (): Output => {
    H.domain(strokeWidth >= 0 && length >= 0);
    H.probability(overlapFraction);
    H.integer(strokes, 0);
    return {
      coveredWidth:
        strokes === 0
          ? 0
          : strokeWidth * (1 + (strokes - 1) * (1 - overlapFraction)),
      coveredArea:
        strokes === 0
          ? 0
          : strokeWidth * (1 + (strokes - 1) * (1 - overlapFraction)) * length,
      excessPaintedArea:
        strokes === 0
          ? 0
          : strokeWidth * length * (strokes - 1) * overlapFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { strokeWidth: 2, overlapFraction: 0.25, strokes: 4, length: 10 },
  output: { coveredWidth: 6.5, coveredArea: 65, excessPaintedArea: 15 },
} satisfies ToolExample<Input, Output>;
export const conservationBrushStrokeOverlapCoverageTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-conservation/conservation-brush-stroke-overlap-coverage",
      title: "Conservation Brush Stroke Overlap Coverage Tool",
      description:
        "Parallel equal-width straight strokes with a fixed adjacent overlap and no change in stroke length.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          strokeWidth: { type: "number", minimum: 0 },
          overlapFraction: { type: "number", minimum: 0, maximum: 1 },
          strokes: { type: "integer", minimum: 0 },
          length: { type: "number", minimum: 0 },
        },
        required: ["strokeWidth", "overlapFraction", "strokes", "length"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coveredWidth: { type: "number" },
          coveredArea: { type: "number" },
          excessPaintedArea: { type: "number" },
        },
        required: ["coveredWidth", "coveredArea", "excessPaintedArea"],
      },
      ports: {
        inputs: [
          {
            id: "strokeWidth",
            label: "Stroke Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overlapFraction",
            label: "Overlap Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "strokes",
            label: "Strokes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "length",
            label: "Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "coveredWidth",
            label: "Covered Width",
            valueType: { type: "number" },
          },
          {
            id: "coveredArea",
            label: "Covered Area",
            valueType: { type: "number" },
          },
          {
            id: "excessPaintedArea",
            label: "Excess Painted Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = conservationBrushStrokeOverlapCoverageTool.execute;
export default conservationBrushStrokeOverlapCoverageTool;
