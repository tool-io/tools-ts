import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly powerDensity: number };
export type Output = { readonly amplitudeDensity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { powerDensity: { type: "number", minimum: 0 } },
  required: ["powerDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { amplitudeDensity: { type: "number" } },
  required: ["amplitudeDensity"],
} as const;
/** Convert a nonnegative power spectral density to its amplitude spectral density in the corresponding square-root bandwidth units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { powerDensity } = request;
  const compute = (): Output => {
    H.domain(powerDensity >= 0);
    return { amplitudeDensity: Math.sqrt(powerDensity) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { powerDensity: 0.0004 },
  output: { amplitudeDensity: 0.02 },
} satisfies ToolExample<Input, Output>;
export const powerSpectralDensityAmplitudeRootFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/power-spectral-density-amplitude-root-factor",
      title: "Power Spectral Density Amplitude Root Factor Tool",
      description:
        "Convert a nonnegative power spectral density to its amplitude spectral density in the corresponding square-root bandwidth units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { powerDensity: { type: "number", minimum: 0 } },
        required: ["powerDensity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { amplitudeDensity: { type: "number" } },
        required: ["amplitudeDensity"],
      },
      ports: {
        inputs: [
          {
            id: "powerDensity",
            label: "Power Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "amplitudeDensity",
            label: "Amplitude Density",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = powerSpectralDensityAmplitudeRootFactorTool.execute;
export default powerSpectralDensityAmplitudeRootFactorTool;
