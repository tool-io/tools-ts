import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly depthIrradiance: number;
  readonly surfaceIrradiance: number;
};
export type Output = {
  readonly remainingLightFraction: number;
  readonly attenuationFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depthIrradiance: { type: "number", minimum: 0 },
    surfaceIrradiance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["depthIrradiance", "surfaceIrradiance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingLightFraction: { type: "number" },
    attenuationFraction: { type: "number" },
  },
  required: ["remainingLightFraction", "attenuationFraction"],
} as const;
/** Compare paired depth and surface irradiance observations, retaining ratios above one without imposing a light-attenuation model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depthIrradiance, surfaceIrradiance } = request;
  const compute = (): Output => {
    (H.domain(surfaceIrradiance > 0, "surfaceIrradiance"), surfaceIrradiance);
    H.domain(depthIrradiance >= 0, "depthIrradiance");
    return {
      remainingLightFraction: depthIrradiance / surfaceIrradiance,
      attenuationFraction: 1 - depthIrradiance / surfaceIrradiance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depthIrradiance: 20, surfaceIrradiance: 100 },
  output: { remainingLightFraction: 0.2, attenuationFraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const aquaticLightDepthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/aquatic-light-depth-ratio",
    title: "Aquatic Light Depth Ratio",
    description:
      "Compare paired depth and surface irradiance observations, retaining ratios above one without imposing a light-attenuation model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depthIrradiance: { type: "number", minimum: 0 },
        surfaceIrradiance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["depthIrradiance", "surfaceIrradiance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingLightFraction: { type: "number" },
        attenuationFraction: { type: "number" },
      },
      required: ["remainingLightFraction", "attenuationFraction"],
    },
    ports: {
      inputs: [
        {
          id: "depthIrradiance",
          label: "Depth Irradiance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "surfaceIrradiance",
          label: "Surface Irradiance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingLightFraction",
          label: "Remaining Light Fraction",
          valueType: { type: "number" },
        },
        {
          id: "attenuationFraction",
          label: "Attenuation Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaticLightDepthRatioTool.execute;
export default aquaticLightDepthRatioTool;
