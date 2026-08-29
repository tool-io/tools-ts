import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PiezoSensorChargeAmplifierVoltageInput = Readonly<{
  readonly sensorChargeCoulombs: number;
  readonly feedbackCapacitanceFarads: number;
}>;
export type PiezoSensorChargeAmplifierVoltageOutput = Readonly<{
  outputVoltageV: number;
}>;

export const calculatePiezoSensorChargeAmplifierVoltage = (
  i: PiezoSensorChargeAmplifierVoltageInput,
): PiezoSensorChargeAmplifierVoltageOutput => {
  const value = -i.sensorChargeCoulombs / i.feedbackCapacitanceFarads;
  if (!Number.isFinite(value))
    simpleError("outputVoltageV", "The inputs produce a non-finite result.");
  return { outputVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { sensorChargeCoulombs: 1e-9, feedbackCapacitanceFarads: 1e-8 },
  output: { outputVoltageV: -0.1 },
} satisfies ToolExample<
  PiezoSensorChargeAmplifierVoltageInput,
  PiezoSensorChargeAmplifierVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/piezo-sensor-charge-amplifier-voltage",
  title: "Piezo Sensor Charge Amplifier Voltage",
  description:
    "Calculate ideal inverting charge-amplifier output voltage as −Q/Cfeedback for a piezoelectric sensor; leakage and reset circuitry are excluded.",
  inputs: [
    {
      id: "sensorChargeCoulombs",
      kind: "number",
      label: "Sensor Charge (C)",
      unit: "C",
    },
    {
      id: "feedbackCapacitanceFarads",
      kind: "number",
      label: "Feedback Capacitance (F)",
      unit: "F",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "outputVoltageV", kind: "number", label: "Output (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculatePiezoSensorChargeAmplifierVoltage({
      sensorChargeCoulombs: input.sensorChargeCoulombs as number,
      feedbackCapacitanceFarads: input.feedbackCapacitanceFarads as number,
    }),
});
export const piezoSensorChargeAmplifierVoltageTool = tool;
export const runPiezoSensorChargeAmplifierVoltage = tool.execute;
export default tool;
