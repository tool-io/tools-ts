import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly originX: number;
  readonly originY: number;
  readonly scale: number;
};
export type Output = { readonly canvasX: number; readonly canvasY: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    originX: { type: "number" },
    originY: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "y", "originX", "originY", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { canvasX: { type: "number" }, canvasY: { type: "number" } },
  required: ["canvasX", "canvasY"],
} as const;
/** Calculate iiif canvas coordinate origin shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, originX, originY, scale } = request;
  const compute = (): Output => {
    H.positive(scale);
    return { canvasX: originX + x * scale, canvasY: originY + y * scale };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 10, y: 20, originX: 100, originY: 200, scale: 0.5 },
  output: { canvasX: 105, canvasY: 210 },
} satisfies ToolExample<Input, Output>;
export const iiifCanvasCoordinateOriginShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/iiif-canvas-coordinate-origin-shift",
    title: "IIIF Canvas Coordinate Origin Shift Tool",
    description:
      "Calculate iiif canvas coordinate origin shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        y: { type: "number" },
        originX: { type: "number" },
        originY: { type: "number" },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["x", "y", "originX", "originY", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { canvasX: { type: "number" }, canvasY: { type: "number" } },
      required: ["canvasX", "canvasY"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        { id: "y", label: "Y", required: true, valueType: { type: "number" } },
        {
          id: "originX",
          label: "Origin X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originY",
          label: "Origin Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "canvasX", label: "Canvas X", valueType: { type: "number" } },
        { id: "canvasY", label: "Canvas Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = iiifCanvasCoordinateOriginShiftTool.execute;
export default iiifCanvasCoordinateOriginShiftTool;
