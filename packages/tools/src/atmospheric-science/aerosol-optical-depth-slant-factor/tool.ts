import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly verticalDepth: number;
  readonly zenithRadians: number;
};
export type Output = { readonly slantDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verticalDepth: { type: "number", minimum: 0 },
    zenithRadians: { type: "number", minimum: 0 },
  },
  required: ["verticalDepth", "zenithRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slantDepth: { type: "number" } },
  required: ["slantDepth"],
} as const;
/** Use the plane-parallel secant air-mass approximation; curvature and refraction are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { verticalDepth, zenithRadians } = request;
  const compute = (): Output => {
    H.domain(
      verticalDepth >= 0 && zenithRadians >= 0 && zenithRadians < Math.PI / 2,
    );
    return { slantDepth: verticalDepth / Math.cos(zenithRadians) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { verticalDepth: 0.2, zenithRadians: 1.0471975511965976 },
  output: { slantDepth: 0.3999999999999999 },
} satisfies ToolExample<Input, Output>;
export const aerosolOpticalDepthSlantFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/aerosol-optical-depth-slant-factor",
    title: "Aerosol Optical Depth Slant Factor Tool",
    description:
      "Use the plane-parallel secant air-mass approximation; curvature and refraction are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verticalDepth: { type: "number", minimum: 0 },
        zenithRadians: { type: "number", minimum: 0 },
      },
      required: ["verticalDepth", "zenithRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slantDepth: { type: "number" } },
      required: ["slantDepth"],
    },
    ports: {
      inputs: [
        {
          id: "verticalDepth",
          label: "Vertical Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zenithRadians",
          label: "Zenith Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "slantDepth",
          label: "Slant Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aerosolOpticalDepthSlantFactorTool.execute;
export default aerosolOpticalDepthSlantFactorTool;
