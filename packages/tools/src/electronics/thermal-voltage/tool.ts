import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermalVoltageInput = {
  readonly temperatureK: number;
};

export type ThermalVoltageOutput = {
  readonly thermalVoltageVolts: number;
};

const K_BOLTZMANN = 1.380649e-23;
const ELEMENTARY_CHARGE = 1.602176634e-19;

export const thermalVoltageExample = {
  input: { temperatureK: 300 },
  output: { thermalVoltageVolts: 0.025851999786435535 },
} satisfies ToolExample<ThermalVoltageInput, ThermalVoltageOutput>;

export const calculateThermalVoltage = (
  input: ThermalVoltageInput,
): ThermalVoltageOutput => {
  if (!(input.temperatureK > 0))
    simpleError(
      "temperatureK",
      "Temperature must be positive.",
      "invalid_temperature",
    );
  return {
    thermalVoltageVolts: (K_BOLTZMANN * input.temperatureK) / ELEMENTARY_CHARGE,
  };
};

export const thermalVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateThermalVoltage(input as unknown as ThermalVoltageInput),
  description:
    "Calculate semiconductor thermal voltage, about 25.85 mV at 300 K.",
  id: "electronics/thermal-voltage",
  inputs: [
    { id: "temperatureK", kind: "number", label: "Temperature", unit: "K" },
  ],
  outputs: [
    {
      id: "thermalVoltageVolts",
      kind: "number",
      label: "Thermal voltage",
      unit: "V",
    },
  ],
  title: "Thermal Voltage VT",
});
export const runThermalVoltage = thermalVoltageTool.execute;
export default thermalVoltageTool;
