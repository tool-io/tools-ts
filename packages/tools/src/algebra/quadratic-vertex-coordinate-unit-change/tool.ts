import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vertexX: number;
  readonly vertexY: number;
  readonly xScale: number;
  readonly xOffset: number;
  readonly yScale: number;
  readonly yOffset: number;
};
export type Output = {
  readonly transformedX: number;
  readonly transformedY: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertexX: { type: "number" },
    vertexY: { type: "number" },
    xScale: { type: "number" },
    xOffset: { type: "number" },
    yScale: { type: "number" },
    yOffset: { type: "number" },
  },
  required: ["vertexX", "vertexY", "xScale", "xOffset", "yScale", "yOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transformedX: { type: "number" },
    transformedY: { type: "number" },
  },
  required: ["transformedX", "transformedY"],
} as const;
/** Affine coordinate-unit transformation of a supplied quadratic vertex. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vertexX, vertexY, xScale, xOffset, yScale, yOffset } = request;
  const compute = (): Output => {
    H.domain(xScale !== 0 && yScale !== 0);
    return {
      transformedX: vertexX * xScale + xOffset,
      transformedY: vertexY * yScale + yOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    vertexX: 2,
    vertexY: 3,
    xScale: 10,
    xOffset: 1,
    yScale: 2,
    yOffset: -1,
  },
  output: { transformedX: 21, transformedY: 5 },
} satisfies ToolExample<Input, Output>;
export const quadraticVertexCoordinateUnitChangeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "algebra/quadratic-vertex-coordinate-unit-change",
      title: "Quadratic Vertex Coordinate Unit Change Tool",
      description:
        "Affine coordinate-unit transformation of a supplied quadratic vertex.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vertexX: { type: "number" },
          vertexY: { type: "number" },
          xScale: { type: "number" },
          xOffset: { type: "number" },
          yScale: { type: "number" },
          yOffset: { type: "number" },
        },
        required: [
          "vertexX",
          "vertexY",
          "xScale",
          "xOffset",
          "yScale",
          "yOffset",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          transformedX: { type: "number" },
          transformedY: { type: "number" },
        },
        required: ["transformedX", "transformedY"],
      },
      ports: {
        inputs: [
          {
            id: "vertexX",
            label: "Vertex X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "vertexY",
            label: "Vertex Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "xScale",
            label: "X Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "xOffset",
            label: "X Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "yScale",
            label: "Y Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "yOffset",
            label: "Y Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "transformedX",
            label: "Transformed X",
            valueType: { type: "number" },
          },
          {
            id: "transformedY",
            label: "Transformed Y",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = quadraticVertexCoordinateUnitChangeTool.execute;
export default quadraticVertexCoordinateUnitChangeTool;
