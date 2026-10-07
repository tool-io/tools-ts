import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly expectedBackgroundPhotons: number };
export type Output = { readonly poissonStandardDeviation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedBackgroundPhotons: { type: "number", minimum: 0 } },
  required: ["expectedBackgroundPhotons"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { poissonStandardDeviation: { type: "number" } },
  required: ["poissonStandardDeviation"],
} as const;
/** Return the square-root photon-count standard deviation for an explicit ideal Poisson background expectation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedBackgroundPhotons } = request;
  const compute = (): Output => {
    H.domain(expectedBackgroundPhotons >= 0, "expectedBackgroundPhotons");
    return { poissonStandardDeviation: Math.sqrt(expectedBackgroundPhotons) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expectedBackgroundPhotons: 25 },
  output: { poissonStandardDeviation: 5 },
} satisfies ToolExample<Input, Output>;
export const fluorophoreBackgroundShotNoiseReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biophysics", "physics"],
        keywords: ["biophysics", "physics"],
      },
      id: "biophysics/fluorophore-background-shot-noise-reference",
      title: "Fluorophore Background Shot Noise Reference",
      description:
        "Return the square-root photon-count standard deviation for an explicit ideal Poisson background expectation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedBackgroundPhotons: { type: "number", minimum: 0 },
        },
        required: ["expectedBackgroundPhotons"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { poissonStandardDeviation: { type: "number" } },
        required: ["poissonStandardDeviation"],
      },
      ports: {
        inputs: [
          {
            id: "expectedBackgroundPhotons",
            label: "Expected Background Photons",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "poissonStandardDeviation",
            label: "Poisson Standard Deviation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fluorophoreBackgroundShotNoiseReferenceTool.execute;
export default fluorophoreBackgroundShotNoiseReferenceTool;
