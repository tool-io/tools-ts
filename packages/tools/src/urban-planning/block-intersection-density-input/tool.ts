import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersectionCount: number;
  readonly areaSquareKilometers: number;
};
export type Output = { readonly intersectionsPerSquareKilometer: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersectionCount: { type: "integer", minimum: 0 },
    areaSquareKilometers: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["intersectionCount", "areaSquareKilometers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intersectionsPerSquareKilometer: { type: "number" } },
  required: ["intersectionsPerSquareKilometer"],
} as const;
/** Normalize a supplied street-intersection count by a positive study area, without defining an intersection-count convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersectionCount, areaSquareKilometers } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(intersectionCount) &&
        intersectionCount >= 0 &&
        intersectionCount <= Number.MAX_SAFE_INTEGER,
      "intersectionCount",
    ),
      intersectionCount);
    (H.domain(areaSquareKilometers > 0, "areaSquareKilometers"),
      areaSquareKilometers);
    return {
      intersectionsPerSquareKilometer: intersectionCount / areaSquareKilometers,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intersectionCount: 40, areaSquareKilometers: 2 },
  output: { intersectionsPerSquareKilometer: 20 },
} satisfies ToolExample<Input, Output>;
export const blockIntersectionDensityInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/block-intersection-density-input",
    title: "Block Intersection Density Input Tool",
    description:
      "Normalize a supplied street-intersection count by a positive study area, without defining an intersection-count convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intersectionCount: { type: "integer", minimum: 0 },
        areaSquareKilometers: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["intersectionCount", "areaSquareKilometers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { intersectionsPerSquareKilometer: { type: "number" } },
      required: ["intersectionsPerSquareKilometer"],
    },
    ports: {
      inputs: [
        {
          id: "intersectionCount",
          label: "Intersection Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "areaSquareKilometers",
          label: "Area Square Kilometers",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "intersectionsPerSquareKilometer",
          label: "Intersections Per Square Kilometer",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = blockIntersectionDensityInputTool.execute;
export default blockIntersectionDensityInputTool;
