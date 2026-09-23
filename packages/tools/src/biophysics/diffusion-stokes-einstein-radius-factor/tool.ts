import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thermalEnergy: number;
  readonly viscosity: number;
  readonly radius: number;
};
export type Output = { readonly diffusivity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thermalEnergy: { type: "number", minimum: 0 },
    viscosity: { type: "number", exclusiveMinimum: 0 },
    radius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["thermalEnergy", "viscosity", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { diffusivity: { type: "number" } },
  required: ["diffusivity"],
} as const;
/** Translational Stokes-Einstein diffusivity for a spherical no-slip particle with thermal energy kB*T supplied explicitly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thermalEnergy, viscosity, radius } = request;
  const compute = (): Output => {
    H.domain(thermalEnergy >= 0);
    H.positive(viscosity);
    H.positive(radius);
    return { diffusivity: thermalEnergy / (6 * Math.PI * viscosity * radius) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thermalEnergy: 18.84955592153876, viscosity: 2, radius: 3 },
  output: { diffusivity: 0.16666666666666666 },
} satisfies ToolExample<Input, Output>;
export const diffusionStokesEinsteinRadiusFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biophysics/diffusion-stokes-einstein-radius-factor",
      title: "Diffusion Stokes Einstein Radius Factor Tool",
      description:
        "Translational Stokes-Einstein diffusivity for a spherical no-slip particle with thermal energy kB*T supplied explicitly.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          thermalEnergy: { type: "number", minimum: 0 },
          viscosity: { type: "number", exclusiveMinimum: 0 },
          radius: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["thermalEnergy", "viscosity", "radius"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { diffusivity: { type: "number" } },
        required: ["diffusivity"],
      },
      ports: {
        inputs: [
          {
            id: "thermalEnergy",
            label: "Thermal Energy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "viscosity",
            label: "Viscosity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "radius",
            label: "Radius",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "diffusivity",
            label: "Diffusivity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = diffusionStokesEinsteinRadiusFactorTool.execute;
export default diffusionStokesEinsteinRadiusFactorTool;
