import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resistance: number;
  readonly thermalResistance: number;
  readonly temperatureCoefficient: number;
};
export type Output = {
  readonly fractionalResistancePerPower: number;
  readonly resistancePerPower: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resistance: { type: "number", minimum: 0 },
    thermalResistance: { type: "number", minimum: 0 },
    temperatureCoefficient: { type: "number" },
  },
  required: ["resistance", "thermalResistance", "temperatureCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractionalResistancePerPower: { type: "number" },
    resistancePerPower: { type: "number" },
  },
  required: ["fractionalResistancePerPower", "resistancePerPower"],
} as const;
/** Linear small-signal self-heating resistance coefficients using supplied thermal resistance and temperature coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resistance, thermalResistance, temperatureCoefficient } = request;
  const compute = (): Output => {
    H.domain(resistance >= 0 && thermalResistance >= 0);
    return {
      fractionalResistancePerPower: thermalResistance * temperatureCoefficient,
      resistancePerPower:
        resistance * thermalResistance * temperatureCoefficient,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resistance: 100,
    thermalResistance: 20,
    temperatureCoefficient: 0.001,
  },
  output: { fractionalResistancePerPower: 0.02, resistancePerPower: 2 },
} satisfies ToolExample<Input, Output>;
export const resistorSelfHeatingPowerCoefficientTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/resistor-self-heating-power-coefficient",
      title: "Resistor Self Heating Power Coefficient Tool",
      description:
        "Linear small-signal self-heating resistance coefficients using supplied thermal resistance and temperature coefficient.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resistance: { type: "number", minimum: 0 },
          thermalResistance: { type: "number", minimum: 0 },
          temperatureCoefficient: { type: "number" },
        },
        required: ["resistance", "thermalResistance", "temperatureCoefficient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fractionalResistancePerPower: { type: "number" },
          resistancePerPower: { type: "number" },
        },
        required: ["fractionalResistancePerPower", "resistancePerPower"],
      },
      ports: {
        inputs: [
          {
            id: "resistance",
            label: "Resistance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "thermalResistance",
            label: "Thermal Resistance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperatureCoefficient",
            label: "Temperature Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fractionalResistancePerPower",
            label: "Fractional Resistance Per Power",
            valueType: { type: "number" },
          },
          {
            id: "resistancePerPower",
            label: "Resistance Per Power",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = resistorSelfHeatingPowerCoefficientTool.execute;
export default resistorSelfHeatingPowerCoefficientTool;
