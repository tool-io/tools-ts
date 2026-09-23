import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCover: number;
  readonly secondCover: number;
  readonly overlapCover: number;
  readonly totalGroundArea: number;
};
export type Output = {
  readonly unionCover: number;
  readonly fractionalCover: number;
  readonly doubleCountFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCover: { type: "number", minimum: 0 },
    secondCover: { type: "number", minimum: 0 },
    overlapCover: { type: "number", minimum: 0 },
    totalGroundArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstCover", "secondCover", "overlapCover", "totalGroundArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unionCover: { type: "number" },
    fractionalCover: { type: "number" },
    doubleCountFraction: { type: "number" },
  },
  required: ["unionCover", "fractionalCover", "doubleCountFraction"],
} as const;
/** Calculate plant canopy cover overlap adjustment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCover, secondCover, overlapCover, totalGroundArea } = request;
  const compute = (): Output => {
    H.positive(totalGroundArea);
    H.domain(
      firstCover >= 0 &&
        secondCover >= 0 &&
        overlapCover >= 0 &&
        overlapCover <= Math.min(firstCover, secondCover) &&
        firstCover + secondCover - overlapCover <= totalGroundArea,
    );
    return {
      unionCover: firstCover + secondCover - overlapCover,
      fractionalCover:
        (firstCover + secondCover - overlapCover) / totalGroundArea,
      doubleCountFraction: overlapCover / totalGroundArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCover: 40,
    secondCover: 30,
    overlapCover: 10,
    totalGroundArea: 100,
  },
  output: { unionCover: 60, fractionalCover: 0.6, doubleCountFraction: 0.1 },
} satisfies ToolExample<Input, Output>;
export const plantCanopyCoverOverlapAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/plant-canopy-cover-overlap-adjustment",
    title: "Plant Canopy Cover Overlap Adjustment Tool",
    description:
      "Calculate plant canopy cover overlap adjustment from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCover: { type: "number", minimum: 0 },
        secondCover: { type: "number", minimum: 0 },
        overlapCover: { type: "number", minimum: 0 },
        totalGroundArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstCover",
        "secondCover",
        "overlapCover",
        "totalGroundArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unionCover: { type: "number" },
        fractionalCover: { type: "number" },
        doubleCountFraction: { type: "number" },
      },
      required: ["unionCover", "fractionalCover", "doubleCountFraction"],
    },
    ports: {
      inputs: [
        {
          id: "firstCover",
          label: "First Cover",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCover",
          label: "Second Cover",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapCover",
          label: "Overlap Cover",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalGroundArea",
          label: "Total Ground Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unionCover",
          label: "Union Cover",
          valueType: { type: "number" },
        },
        {
          id: "fractionalCover",
          label: "Fractional Cover",
          valueType: { type: "number" },
        },
        {
          id: "doubleCountFraction",
          label: "Double Count Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = plantCanopyCoverOverlapAdjustmentTool.execute;
export default plantCanopyCoverOverlapAdjustmentTool;
