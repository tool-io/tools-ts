import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperatureKelvin: number;
  readonly suppliedBoltzmannConstant: number;
};
export type Output = { readonly thermalEnergy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperatureKelvin: { type: "number", minimum: 0 },
    suppliedBoltzmannConstant: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["temperatureKelvin", "suppliedBoltzmannConstant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { thermalEnergy: { type: "number" } },
  required: ["thermalEnergy"],
} as const;
/** Multiply absolute temperature by an explicitly supplied Boltzmann constant to obtain kT in compatible energy units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperatureKelvin, suppliedBoltzmannConstant } = request;
  const compute = (): Output => {
    H.domain(temperatureKelvin >= 0, "temperatureKelvin");
    (H.domain(
      Number.isFinite(suppliedBoltzmannConstant) &&
        suppliedBoltzmannConstant > 0,
      "suppliedBoltzmannConstant",
    ),
      suppliedBoltzmannConstant);
    return { thermalEnergy: temperatureKelvin * suppliedBoltzmannConstant };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { temperatureKelvin: 300, suppliedBoltzmannConstant: 1.38e-23 },
  output: { thermalEnergy: 4.14e-21 },
} satisfies ToolExample<Input, Output>;
export const biophysicalTemperatureEnergyfactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/biophysical-temperature-energy-factor",
    title: "Biophysical Temperature Energy Factor",
    description:
      "Multiply absolute temperature by an explicitly supplied Boltzmann constant to obtain kT in compatible energy units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temperatureKelvin: { type: "number", minimum: 0 },
        suppliedBoltzmannConstant: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["temperatureKelvin", "suppliedBoltzmannConstant"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { thermalEnergy: { type: "number" } },
      required: ["thermalEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "temperatureKelvin",
          label: "Temperature Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBoltzmannConstant",
          label: "Supplied Boltzmann Constant",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "thermalEnergy",
          label: "Thermal Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biophysicalTemperatureEnergyfactorTool.execute;
export default biophysicalTemperatureEnergyfactorTool;
