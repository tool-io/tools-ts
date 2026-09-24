import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly field: number; readonly permeability: number };
export type Output = { readonly energyDensity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    field: { type: "number" },
    permeability: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["field", "permeability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyDensity: { type: "number" } },
  required: ["energyDensity"],
} as const;
/** Return B²/(2*mu) for an explicitly linear nondispersive magnetic medium in compatible SI units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { field, permeability } = request;
  const compute = (): Output => {
    H.positive(permeability);
    return { energyDensity: (field * field) / (2 * permeability) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { field: 2, permeability: 4 },
  output: { energyDensity: 0.5 },
} satisfies ToolExample<Input, Output>;
export const magneticFieldEnergyDensityPermeabilityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/magnetic-field-energy-density-permeability-factor",
      title: "Magnetic Field Energy Density Permeability Factor Tool",
      description:
        "Return B²/(2*mu) for an explicitly linear nondispersive magnetic medium in compatible SI units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          field: { type: "number" },
          permeability: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["field", "permeability"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { energyDensity: { type: "number" } },
        required: ["energyDensity"],
      },
      ports: {
        inputs: [
          {
            id: "field",
            label: "Field",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "permeability",
            label: "Permeability",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "energyDensity",
            label: "Energy Density",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = magneticFieldEnergyDensityPermeabilityFactorTool.execute;
export default magneticFieldEnergyDensityPermeabilityFactorTool;
