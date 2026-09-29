import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intensity: number;
  readonly referenceIntensity: number;
  readonly darkOffset: number;
};
export type Output = { readonly opticalDensity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intensity: { type: "number" },
    referenceIntensity: { type: "number" },
    darkOffset: { type: "number" },
  },
  required: ["intensity", "referenceIntensity", "darkOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { opticalDensity: { type: "number" } },
  required: ["opticalDensity"],
} as const;
/** Compute base-ten optical density from supplied dark-corrected research image intensities; negative values remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intensity, referenceIntensity, darkOffset } = request;
  const compute = (): Output => {
    H.domain(intensity > darkOffset && referenceIntensity > darkOffset);
    return {
      opticalDensity:
        Math.log10(referenceIntensity - darkOffset) -
        Math.log10(intensity - darkOffset),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intensity: 10, referenceIntensity: 100, darkOffset: 0 },
  output: { opticalDensity: 1 },
} satisfies ToolExample<Input, Output>;
export const stainChannelOpticalDensityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/stain-channel-optical-density",
    title: "Stain Channel Optical Density Tool",
    description:
      "Compute base-ten optical density from supplied dark-corrected research image intensities; negative values remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intensity: { type: "number" },
        referenceIntensity: { type: "number" },
        darkOffset: { type: "number" },
      },
      required: ["intensity", "referenceIntensity", "darkOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { opticalDensity: { type: "number" } },
      required: ["opticalDensity"],
    },
    ports: {
      inputs: [
        {
          id: "intensity",
          label: "Intensity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceIntensity",
          label: "Reference Intensity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "darkOffset",
          label: "Dark Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "opticalDensity",
          label: "Optical Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stainChannelOpticalDensityTool.execute;
export default stainChannelOpticalDensityTool;
