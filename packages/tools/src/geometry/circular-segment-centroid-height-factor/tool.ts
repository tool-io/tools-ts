import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly radius: number; readonly halfAngle: number };
export type Output = { readonly distanceFromCenter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    halfAngle: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["radius", "halfAngle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distanceFromCenter: { type: "number" } },
  required: ["distanceFromCenter"],
} as const;
/** Calculate circular segment centroid height factor from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { radius, halfAngle } = input;
  const compute = (): Output => {
    H.positive(radius);
    H.domain(halfAngle > 0 && halfAngle <= Math.PI);
    const denominator = 3 * (2 * halfAngle - Math.sin(2 * halfAngle));
    H.positive(denominator);
    return {
      distanceFromCenter: (4 * radius * Math.sin(halfAngle) ** 3) / denominator,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radius: 3, halfAngle: 1.5707963267948966 },
  output: { distanceFromCenter: 1.2732395447351628 },
} satisfies ToolExample<Input, Output>;
export const circularSegmentCentroidHeightFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geometry/circular-segment-centroid-height-factor",
      title: "Circular Segment Centroid Height Factor Tool",
      description:
        "Calculate circular segment centroid height factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radius: { type: "number", exclusiveMinimum: 0 },
          halfAngle: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["radius", "halfAngle"],
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
            id: "halfAngle",
            label: "Half Angle",
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
export const run = circularSegmentCentroidHeightFactorTool.execute;
export default circularSegmentCentroidHeightFactorTool;
