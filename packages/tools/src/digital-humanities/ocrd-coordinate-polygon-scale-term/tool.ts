import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: readonly number[];
  readonly y: readonly number[];
  readonly xScale: number;
  readonly yScale: number;
  readonly offsetX: number;
  readonly offsetY: number;
};
export type Output = {
  readonly x: readonly number[];
  readonly y: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "array", maxItems: 256, items: { type: "number" } },
    y: { type: "array", maxItems: 256, items: { type: "number" } },
    xScale: { type: "number", exclusiveMinimum: 0 },
    yScale: { type: "number", exclusiveMinimum: 0 },
    offsetX: { type: "number" },
    offsetY: { type: "number" },
  },
  required: ["x", "y", "xScale", "yScale", "offsetX", "offsetY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "array", maxItems: 256, items: { type: "number" } },
    y: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["x", "y"],
} as const;
/** Scale and translate an explicit polygon coordinate list, retaining vertex order without validating polygon topology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, xScale, yScale, offsetX, offsetY } = request;
  const compute = (): Output => {
    H.sameLength(x, y);
    H.positive(xScale);
    H.positive(yScale);
    H.domain(x.length >= 3);
    return {
      x: x.map((v) => v * xScale + offsetX),
      y: y.map((v) => v * yScale + offsetY),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    x: [0, 2, 0],
    y: [0, 0, 3],
    xScale: 2,
    yScale: 3,
    offsetX: 1,
    offsetY: 2,
  },
  output: { x: [1, 5, 1], y: [2, 2, 11] },
} satisfies ToolExample<Input, Output>;
export const ocrdCoordinatePolygonScaleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/ocrd-coordinate-polygon-scale-term",
    title: "OCR-D Coordinate Polygon Scale Term Tool",
    description:
      "Scale and translate an explicit polygon coordinate list, retaining vertex order without validating polygon topology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "array", maxItems: 256, items: { type: "number" } },
        y: { type: "array", maxItems: 256, items: { type: "number" } },
        xScale: { type: "number", exclusiveMinimum: 0 },
        yScale: { type: "number", exclusiveMinimum: 0 },
        offsetX: { type: "number" },
        offsetY: { type: "number" },
      },
      required: ["x", "y", "xScale", "yScale", "offsetX", "offsetY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "array", maxItems: 256, items: { type: "number" } },
        y: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["x", "y"],
    },
    ports: {
      inputs: [
        {
          id: "x",
          label: "X",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "y",
          label: "Y",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "xScale",
          label: "X Scale",
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
          id: "offsetX",
          label: "Offset X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetY",
          label: "Offset Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "x",
          label: "X",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "y",
          label: "Y",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = ocrdCoordinatePolygonScaleTermTool.execute;
export default ocrdCoordinatePolygonScaleTermTool;
