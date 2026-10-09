import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly baseRadius: number; readonly height: number };
export type Output = {
  readonly angleToBaseRadians: number;
  readonly slantLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseRadius: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
  },
  required: ["baseRadius", "height"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleToBaseRadians: { type: "number" },
    slantLength: { type: "number" },
  },
  required: ["angleToBaseRadians", "slantLength"],
} as const;
/** Calculate the explicit right-cone slant angle above its base and slant length from radius and height. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseRadius, height } = request;
  const compute = (): Output => {
    H.domain(baseRadius >= 0 && height >= 0, "baseRadius");
    H.domain(baseRadius > 0 || height > 0, "height");
    return {
      angleToBaseRadians: Math.atan2(height, baseRadius),
      slantLength: Math.hypot(baseRadius, height),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseRadius: 3, height: 4 },
  output: { angleToBaseRadians: 0.9272952180016122, slantLength: 5 },
} satisfies ToolExample<Input, Output>;
export const coneBaseToSlantAngleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geometry", "mathematics"],
      keywords: ["geometry", "mathematics"],
    },
    id: "geometry/cone-base-to-slant-angle",
    title: "Cone Base To Slant Angle",
    description:
      "Calculate the explicit right-cone slant angle above its base and slant length from radius and height.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseRadius: { type: "number", minimum: 0 },
        height: { type: "number", minimum: 0 },
      },
      required: ["baseRadius", "height"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleToBaseRadians: { type: "number" },
        slantLength: { type: "number" },
      },
      required: ["angleToBaseRadians", "slantLength"],
    },
    ports: {
      inputs: [
        {
          id: "baseRadius",
          label: "Base Radius",
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
          id: "angleToBaseRadians",
          label: "Angle To Base Radians",
          valueType: { type: "number" },
        },
        {
          id: "slantLength",
          label: "Slant Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coneBaseToSlantAngleTool.execute;
export default coneBaseToSlantAngleTool;
