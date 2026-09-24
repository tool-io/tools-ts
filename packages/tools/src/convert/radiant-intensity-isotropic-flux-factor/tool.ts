import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly intensity: number };
export type Output = { readonly flux: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intensity: { type: "number", minimum: 0 } },
  required: ["intensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flux: { type: "number" } },
  required: ["flux"],
} as const;
/** Convert uniform radiant intensity per steradian to total full-sphere radiant flux. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intensity } = request;
  const compute = (): Output => {
    H.domain(intensity >= 0);
    return { flux: 4 * Math.PI * intensity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intensity: 2 },
  output: { flux: 25.132741228718345 },
} satisfies ToolExample<Input, Output>;
export const radiantIntensityIsotropicFluxFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/radiant-intensity-isotropic-flux-factor",
      title: "Radiant Intensity Isotropic Flux Factor Tool",
      description:
        "Convert uniform radiant intensity per steradian to total full-sphere radiant flux.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { intensity: { type: "number", minimum: 0 } },
        required: ["intensity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { flux: { type: "number" } },
        required: ["flux"],
      },
      ports: {
        inputs: [
          {
            id: "intensity",
            label: "Intensity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [{ id: "flux", label: "Flux", valueType: { type: "number" } }],
      },
    },
    calculate,
  });
export const run = radiantIntensityIsotropicFluxFactorTool.execute;
export default radiantIntensityIsotropicFluxFactorTool;
