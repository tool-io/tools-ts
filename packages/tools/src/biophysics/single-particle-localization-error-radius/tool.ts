import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly xError: number; readonly yError: number };
export type Output = { readonly radialError: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { xError: { type: "number" }, yError: { type: "number" } },
  required: ["xError", "yError"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radialError: { type: "number" } },
  required: ["radialError"],
} as const;
/** Combine signed 2D localization-coordinate errors into a Euclidean error radius without estimating uncertainty from images. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { xError, yError } = request;
  const compute = (): Output => {
    return { radialError: Math.hypot(xError, yError) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { xError: 3, yError: 4 },
  output: { radialError: 5 },
} satisfies ToolExample<Input, Output>;
export const singleParticleLocalizationErrorRadiusTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biophysics", "physics"],
        keywords: ["biophysics", "physics"],
      },
      id: "biophysics/single-particle-localization-error-radius",
      title: "Single Particle Localization Error Radius",
      description:
        "Combine signed 2D localization-coordinate errors into a Euclidean error radius without estimating uncertainty from images.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { xError: { type: "number" }, yError: { type: "number" } },
        required: ["xError", "yError"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { radialError: { type: "number" } },
        required: ["radialError"],
      },
      ports: {
        inputs: [
          {
            id: "xError",
            label: "X Error",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "yError",
            label: "Y Error",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "radialError",
            label: "Radial Error",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = singleParticleLocalizationErrorRadiusTool.execute;
export default singleParticleLocalizationErrorRadiusTool;
