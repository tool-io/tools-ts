import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly energy: number;
  readonly temperatureKelvin: number;
  readonly suppliedBoltzmannConstant: number;
};
export type Output = { readonly energyOverThermal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energy: { type: "number" },
    temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
    suppliedBoltzmannConstant: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["energy", "temperatureKelvin", "suppliedBoltzmannConstant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyOverThermal: { type: "number" } },
  required: ["energyOverThermal"],
} as const;
/** Normalize supplied signed energy by k*T using an explicit compatible Boltzmann constant. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { energy, temperatureKelvin, suppliedBoltzmannConstant } = request;
  const compute = (): Output => {
    H.positive(temperatureKelvin);
    H.positive(suppliedBoltzmannConstant);
    return {
      energyOverThermal:
        energy / (temperatureKelvin * suppliedBoltzmannConstant),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { energy: 20, temperatureKelvin: 10, suppliedBoltzmannConstant: 2 },
  output: { energyOverThermal: 1 },
} satisfies ToolExample<Input, Output>;
export const thermalFluctuationEnergyRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/thermal-fluctuation-energy-ratio",
    title: "Thermal Fluctuation Energy Ratio Tool",
    description:
      "Normalize supplied signed energy by k*T using an explicit compatible Boltzmann constant.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energy: { type: "number" },
        temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
        suppliedBoltzmannConstant: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["energy", "temperatureKelvin", "suppliedBoltzmannConstant"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { energyOverThermal: { type: "number" } },
      required: ["energyOverThermal"],
    },
    ports: {
      inputs: [
        {
          id: "energy",
          label: "Energy",
          required: true,
          valueType: { type: "number" },
        },
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
          id: "energyOverThermal",
          label: "Energy Over Thermal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = thermalFluctuationEnergyRatioTool.execute;
export default thermalFluctuationEnergyRatioTool;
