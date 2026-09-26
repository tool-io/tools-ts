import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly referenceX: number;
  readonly referenceY: number;
};
export type Output = {
  readonly relativeX: number;
  readonly relativeY: number;
  readonly distance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
    referenceX: { type: "number" },
    referenceY: { type: "number" },
  },
  required: ["x", "y", "scale", "referenceX", "referenceY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeX: { type: "number" },
    relativeY: { type: "number" },
    distance: { type: "number" },
  },
  required: ["relativeX", "relativeY", "distance"],
} as const;
/** Calibrated coordinates relative to one explicit landmark, without rotation or Procrustes fitting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, scale, referenceX, referenceY } = request;
  const compute = (): Output => {
    H.positive(scale);
    return {
      relativeX: (x - referenceX) * scale,
      relativeY: (y - referenceY) * scale,
      distance: Math.hypot(x - referenceX, y - referenceY) * scale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 4, y: 6, scale: 2, referenceX: 1, referenceY: 2 },
  output: { relativeX: 6, relativeY: 8, distance: 10 },
} satisfies ToolExample<Input, Output>;
export const wingVenationLandmarkCoordinateScaleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entomology/wing-venation-landmark-coordinate-scale",
      title: "Wing Venation Landmark Coordinate Scale Tool",
      description:
        "Calibrated coordinates relative to one explicit landmark, without rotation or Procrustes fitting.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          x: { type: "number" },
          y: { type: "number" },
          scale: { type: "number", exclusiveMinimum: 0 },
          referenceX: { type: "number" },
          referenceY: { type: "number" },
        },
        required: ["x", "y", "scale", "referenceX", "referenceY"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          relativeX: { type: "number" },
          relativeY: { type: "number" },
          distance: { type: "number" },
        },
        required: ["relativeX", "relativeY", "distance"],
      },
      ports: {
        inputs: [
          {
            id: "x",
            label: "X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "y",
            label: "Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scale",
            label: "Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceX",
            label: "Reference X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceY",
            label: "Reference Y",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeX",
            label: "Relative X",
            valueType: { type: "number" },
          },
          {
            id: "relativeY",
            label: "Relative Y",
            valueType: { type: "number" },
          },
          { id: "distance", label: "Distance", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = wingVenationLandmarkCoordinateScaleTool.execute;
export default wingVenationLandmarkCoordinateScaleTool;
