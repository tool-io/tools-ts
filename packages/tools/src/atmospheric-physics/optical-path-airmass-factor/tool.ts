import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zenithRadians: number;
  readonly verticalOpticalDepth: number;
};
export type Output = {
  readonly airmass: number;
  readonly slantOpticalDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zenithRadians: { type: "number", minimum: 0 },
    verticalOpticalDepth: { type: "number", minimum: 0 },
  },
  required: ["zenithRadians", "verticalOpticalDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    airmass: { type: "number" },
    slantOpticalDepth: { type: "number" },
  },
  required: ["airmass", "slantOpticalDepth"],
} as const;
/** Use a plane-parallel secant airmass approximation, excluding the horizon and atmospheric curvature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zenithRadians, verticalOpticalDepth } = request;
  const compute = (): Output => {
    H.domain(
      zenithRadians >= 0 &&
        zenithRadians < Math.PI / 2 &&
        verticalOpticalDepth >= 0,
    );
    return {
      airmass: 1 / Math.cos(zenithRadians),
      slantOpticalDepth: verticalOpticalDepth / Math.cos(zenithRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zenithRadians: 0, verticalOpticalDepth: 0.2 },
  output: { airmass: 1, slantOpticalDepth: 0.2 },
} satisfies ToolExample<Input, Output>;
export const opticalPathAirmassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/optical-path-airmass-factor",
    title: "Optical Path Airmass Factor Tool",
    description:
      "Use a plane-parallel secant airmass approximation, excluding the horizon and atmospheric curvature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zenithRadians: { type: "number", minimum: 0 },
        verticalOpticalDepth: { type: "number", minimum: 0 },
      },
      required: ["zenithRadians", "verticalOpticalDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        airmass: { type: "number" },
        slantOpticalDepth: { type: "number" },
      },
      required: ["airmass", "slantOpticalDepth"],
    },
    ports: {
      inputs: [
        {
          id: "zenithRadians",
          label: "Zenith Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "verticalOpticalDepth",
          label: "Vertical Optical Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "airmass", label: "Airmass", valueType: { type: "number" } },
        {
          id: "slantOpticalDepth",
          label: "Slant Optical Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = opticalPathAirmassFactorTool.execute;
export default opticalPathAirmassFactorTool;
