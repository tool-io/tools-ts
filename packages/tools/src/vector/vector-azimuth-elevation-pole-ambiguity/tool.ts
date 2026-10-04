import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};
export type Output = {
  readonly pole: boolean;
  readonly origin: boolean;
  readonly azimuthRadians: number;
  readonly elevationRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    z: { type: "number" },
  },
  required: ["x", "y", "z"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pole: { type: "boolean" },
    origin: { type: "boolean" },
    azimuthRadians: { type: "number" },
    elevationRadians: { type: "number" },
  },
  required: ["pole", "origin", "azimuthRadians", "elevationRadians"],
} as const;
/** Calculate vector azimuth elevation pole ambiguity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, z } = request;
  const compute = (): Output => {
    const horizontal = Math.hypot(x, y),
      origin = horizontal === 0 && z === 0;
    return {
      pole: horizontal === 0 && !origin,
      origin,
      azimuthRadians: horizontal === 0 ? 0 : Math.atan2(y, x),
      elevationRadians: origin ? 0 : Math.atan2(z, horizontal),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 0, y: 0, z: 3 },
  output: {
    pole: true,
    origin: false,
    azimuthRadians: 0,
    elevationRadians: 1.5707963267948966,
  },
} satisfies ToolExample<Input, Output>;
export const vectorAzimuthElevationPoleAmbiguityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-azimuth-elevation-pole-ambiguity",
      title: "Vector Azimuth Elevation Pole Ambiguity Tool",
      description:
        "Calculate vector azimuth elevation pole ambiguity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          x: { type: "number" },
          y: { type: "number" },
          z: { type: "number" },
        },
        required: ["x", "y", "z"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pole: { type: "boolean" },
          origin: { type: "boolean" },
          azimuthRadians: { type: "number" },
          elevationRadians: { type: "number" },
        },
        required: ["pole", "origin", "azimuthRadians", "elevationRadians"],
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
            id: "z",
            label: "Z",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "pole", label: "Pole", valueType: { type: "boolean" } },
          { id: "origin", label: "Origin", valueType: { type: "boolean" } },
          {
            id: "azimuthRadians",
            label: "Azimuth Radians",
            valueType: { type: "number" },
          },
          {
            id: "elevationRadians",
            label: "Elevation Radians",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vectorAzimuthElevationPoleAmbiguityTool.execute;
export default vectorAzimuthElevationPoleAmbiguityTool;
