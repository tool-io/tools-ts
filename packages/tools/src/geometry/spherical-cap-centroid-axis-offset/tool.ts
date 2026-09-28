import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly radius: number; readonly height: number };
export type Output = { readonly distanceFromCenter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["radius", "height"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distanceFromCenter: { type: "number" } },
  required: ["distanceFromCenter"],
} as const;
/** Return the volume centroid axial coordinate of a solid spherical cap measured from the sphere center toward the cap. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { radius, height } = input;
  const compute = (): Output => {
    H.positive(radius);
    H.domain(height > 0 && height <= 2 * radius);
    return {
      distanceFromCenter:
        (3 * (2 * radius - height) ** 2) / (4 * (3 * radius - height)),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radius: 3, height: 3 },
  output: { distanceFromCenter: 1.125 },
} satisfies ToolExample<Input, Output>;
export const sphericalCapCentroidAxisOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/spherical-cap-centroid-axis-offset",
    title: "Spherical Cap Centroid Axis Offset Tool",
    description:
      "Return the volume centroid axial coordinate of a solid spherical cap measured from the sphere center toward the cap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        height: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["radius", "height"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distanceFromCenter: { type: "number" } },
      required: ["distanceFromCenter"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "distanceFromCenter",
          label: "Distance From Center",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sphericalCapCentroidAxisOffsetTool.execute;
export default sphericalCapCentroidAxisOffsetTool;
