import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly projectedAreas: readonly number[];
  readonly overlappingArea: number;
  readonly totalArea: number;
};
export type Output = {
  readonly shadowedUnion: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectedAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    overlappingArea: { type: "number", minimum: 0 },
    totalArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["projectedAreas", "overlappingArea", "totalArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shadowedUnion: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["shadowedUnion", "fraction"],
} as const;
/** Calculate rack column shadowed area fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { projectedAreas, overlappingArea, totalArea } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(
      projectedAreas.every((x) => x >= 0) &&
        overlappingArea >= 0 &&
        overlappingArea <= projectedAreas.reduce((a, b) => a + b, 0) &&
        projectedAreas.reduce((a, b) => a + b, 0) - overlappingArea <=
          totalArea,
    );
    return {
      shadowedUnion:
        projectedAreas.reduce((a, b) => a + b, 0) - overlappingArea,
      fraction:
        (projectedAreas.reduce((a, b) => a + b, 0) - overlappingArea) /
        totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { projectedAreas: [10, 15], overlappingArea: 5, totalArea: 100 },
  output: { shadowedUnion: 20, fraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const rackColumnShadowedAreaFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/rack-column-shadowed-area-fraction",
    title: "Rack Column Shadowed Area Fraction Tool",
    description:
      "Calculate rack column shadowed area fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        projectedAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        overlappingArea: { type: "number", minimum: 0 },
        totalArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["projectedAreas", "overlappingArea", "totalArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shadowedUnion: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["shadowedUnion", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "projectedAreas",
          label: "Projected Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "overlappingArea",
          label: "Overlapping Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shadowedUnion",
          label: "Shadowed Union",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rackColumnShadowedAreaFractionTool.execute;
export default rackColumnShadowedAreaFractionTool;
