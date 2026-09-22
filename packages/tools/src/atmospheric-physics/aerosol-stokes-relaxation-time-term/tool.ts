import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly particleDensity: number;
  readonly diameter: number;
  readonly slipCorrection: number;
  readonly viscosity: number;
};
export type Output = { readonly relaxationTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    particleDensity: { type: "number", minimum: 0 },
    diameter: { type: "number", minimum: 0 },
    slipCorrection: { type: "number", exclusiveMinimum: 0 },
    viscosity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["particleDensity", "diameter", "slipCorrection", "viscosity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relaxationTime: { type: "number" } },
  required: ["relaxationTime"],
} as const;
/** Calculate aerosol stokes relaxation time term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { particleDensity, diameter, slipCorrection, viscosity } = request;
  const compute = (): Output => {
    H.domain(particleDensity >= 0 && diameter >= 0);
    H.positive(slipCorrection);
    H.positive(viscosity);
    return {
      relaxationTime:
        (particleDensity * diameter ** 2 * slipCorrection) / (18 * viscosity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    particleDensity: 1800,
    diameter: 0.00001,
    slipCorrection: 1,
    viscosity: 0.00002,
  },
  output: { relaxationTime: 0.0005 },
} satisfies ToolExample<Input, Output>;
export const aerosolStokesRelaxationTimeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/aerosol-stokes-relaxation-time-term",
    title: "Aerosol Stokes Relaxation Time Term Tool",
    description:
      "Calculate aerosol stokes relaxation time term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        particleDensity: { type: "number", minimum: 0 },
        diameter: { type: "number", minimum: 0 },
        slipCorrection: { type: "number", exclusiveMinimum: 0 },
        viscosity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["particleDensity", "diameter", "slipCorrection", "viscosity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relaxationTime: { type: "number" } },
      required: ["relaxationTime"],
    },
    ports: {
      inputs: [
        {
          id: "particleDensity",
          label: "Particle Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diameter",
          label: "Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slipCorrection",
          label: "Slip Correction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "viscosity",
          label: "Viscosity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relaxationTime",
          label: "Relaxation Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aerosolStokesRelaxationTimeTermTool.execute;
export default aerosolStokesRelaxationTimeTermTool;
