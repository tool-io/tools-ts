import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCount: number;
  readonly secondCount: number;
  readonly matchedOverlapCount: number;
  readonly firstArea: number;
  readonly secondArea: number;
  readonly overlapArea: number;
};
export type Output = {
  readonly uniqueCount: number;
  readonly unionArea: number;
  readonly density: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCount: { type: "integer", minimum: 0 },
    secondCount: { type: "integer", minimum: 0 },
    matchedOverlapCount: { type: "integer", minimum: 0 },
    firstArea: { type: "number", exclusiveMinimum: 0 },
    secondArea: { type: "number", exclusiveMinimum: 0 },
    overlapArea: { type: "number", minimum: 0 },
  },
  required: [
    "firstCount",
    "secondCount",
    "matchedOverlapCount",
    "firstArea",
    "secondArea",
    "overlapArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueCount: { type: "integer" },
    unionArea: { type: "number" },
    density: { type: "number" },
  },
  required: ["uniqueCount", "unionArea", "density"],
} as const;
/** Unique object count and field-union area from explicit cross-field matches; no image registration or automated deduplication. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstCount,
    secondCount,
    matchedOverlapCount,
    firstArea,
    secondArea,
    overlapArea,
  } = request;
  const compute = (): Output => {
    H.integer(firstCount, 0);
    H.integer(secondCount, 0);
    H.integer(matchedOverlapCount, 0, Math.min(firstCount, secondCount));
    H.domain(
      firstArea > 0 &&
        secondArea > 0 &&
        overlapArea >= 0 &&
        overlapArea <= Math.min(firstArea, secondArea),
    );
    return {
      uniqueCount: firstCount + secondCount - matchedOverlapCount,
      unionArea: firstArea + secondArea - overlapArea,
      density:
        (firstCount + secondCount - matchedOverlapCount) /
        (firstArea + secondArea - overlapArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCount: 30,
    secondCount: 25,
    matchedOverlapCount: 5,
    firstArea: 2,
    secondArea: 2,
    overlapArea: 0.5,
  },
  output: { uniqueCount: 50, unionArea: 3.5, density: 14.285714285714286 },
} satisfies ToolExample<Input, Output>;
export const microscopyFieldOverlapCountAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "microbiology/microscopy-field-overlap-count-adjustment",
      title: "Microscopy Field Overlap Count Adjustment Tool",
      description:
        "Unique object count and field-union area from explicit cross-field matches; no image registration or automated deduplication.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstCount: { type: "integer", minimum: 0 },
          secondCount: { type: "integer", minimum: 0 },
          matchedOverlapCount: { type: "integer", minimum: 0 },
          firstArea: { type: "number", exclusiveMinimum: 0 },
          secondArea: { type: "number", exclusiveMinimum: 0 },
          overlapArea: { type: "number", minimum: 0 },
        },
        required: [
          "firstCount",
          "secondCount",
          "matchedOverlapCount",
          "firstArea",
          "secondArea",
          "overlapArea",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uniqueCount: { type: "integer" },
          unionArea: { type: "number" },
          density: { type: "number" },
        },
        required: ["uniqueCount", "unionArea", "density"],
      },
      ports: {
        inputs: [
          {
            id: "firstCount",
            label: "First Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondCount",
            label: "Second Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "matchedOverlapCount",
            label: "Matched Overlap Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstArea",
            label: "First Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondArea",
            label: "Second Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overlapArea",
            label: "Overlap Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "uniqueCount",
            label: "Unique Count",
            valueType: { type: "integer" },
          },
          {
            id: "unionArea",
            label: "Union Area",
            valueType: { type: "number" },
          },
          { id: "density", label: "Density", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = microscopyFieldOverlapCountAdjustmentTool.execute;
export default microscopyFieldOverlapCountAdjustmentTool;
