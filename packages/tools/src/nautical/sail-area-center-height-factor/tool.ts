import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly areas: readonly number[];
  readonly centerHeights: readonly number[];
};
export type Output = {
  readonly areaHeightMoment: number;
  readonly totalArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areas: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    centerHeights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["areas", "centerHeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaHeightMoment: { type: "number" },
    totalArea: { type: "number" },
  },
  required: ["areaHeightMoment", "totalArea"],
} as const;
/** Sum supplied projected sail-area times center height; this is a geometric moment, not a stability assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { areas, centerHeights } = request;
  const compute = (): Output => {
    H.domain(areas.every((x) => x >= 0));
    return {
      areaHeightMoment: H.dot(areas, centerHeights),
      totalArea: areas.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { areas: [3, 5], centerHeights: [2, 4] },
  output: { areaHeightMoment: 26, totalArea: 8 },
} satisfies ToolExample<Input, Output>;
export const sailAreaCenterHeightFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/sail-area-center-height-factor",
    title: "Sail Area Center Height Factor Tool",
    description:
      "Sum supplied projected sail-area times center height; this is a geometric moment, not a stability assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        centerHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["areas", "centerHeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaHeightMoment: { type: "number" },
        totalArea: { type: "number" },
      },
      required: ["areaHeightMoment", "totalArea"],
    },
    ports: {
      inputs: [
        {
          id: "areas",
          label: "Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "centerHeights",
          label: "Center Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "areaHeightMoment",
          label: "Area Height Moment",
          valueType: { type: "number" },
        },
        { id: "totalArea", label: "Total Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sailAreaCenterHeightFactorTool.execute;
export default sailAreaCenterHeightFactorTool;
