import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vertexToCentroid: number;
  readonly centroidToMidpoint: number;
};
export type Output = {
  readonly ratio: number;
  readonly twoToOneResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertexToCentroid: { type: "number", minimum: 0 },
    centroidToMidpoint: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["vertexToCentroid", "centroidToMidpoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    twoToOneResidual: { type: "number" },
  },
  required: ["ratio", "twoToOneResidual"],
} as const;
/** Compare supplied collinear median segments to the centroid’s two-to-one division. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vertexToCentroid, centroidToMidpoint } = request;
  const compute = (): Output => {
    H.domain(vertexToCentroid >= 0);
    H.positive(centroidToMidpoint);
    return {
      ratio: vertexToCentroid / centroidToMidpoint,
      twoToOneResidual: vertexToCentroid - 2 * centroidToMidpoint,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vertexToCentroid: 8, centroidToMidpoint: 4 },
  output: { ratio: 2, twoToOneResidual: 0 },
} satisfies ToolExample<Input, Output>;
export const triangleMedianRatioTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "geometry/triangle-median-ratio",
      title: "Triangle Median Ratio Tool",
      description:
        "Compare supplied collinear median segments to the centroid’s two-to-one division.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vertexToCentroid: { type: "number", minimum: 0 },
          centroidToMidpoint: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["vertexToCentroid", "centroidToMidpoint"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ratio: { type: "number" },
          twoToOneResidual: { type: "number" },
        },
        required: ["ratio", "twoToOneResidual"],
      },
      ports: {
        inputs: [
          {
            id: "vertexToCentroid",
            label: "Vertex To Centroid",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "centroidToMidpoint",
            label: "Centroid To Midpoint",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
          {
            id: "twoToOneResidual",
            label: "Two To One Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = triangleMedianRatioTool.execute;
export default triangleMedianRatioTool;
