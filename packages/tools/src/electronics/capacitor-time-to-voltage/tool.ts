import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorTimeToVoltageInput = {
  readonly capacitanceF: number;
  readonly resistanceOhms: number;
  readonly supplyVolts: number;
  readonly targetVolts: number;
};

export type CapacitorTimeToVoltageOutput = {
  readonly timeSeconds: number;
};

export const capacitorTimeToVoltageExample = {
  input: {
    capacitanceF: 1e-6,
    resistanceOhms: 10000,
    supplyVolts: 5,
    targetVolts: 2.5,
  },
  output: { timeSeconds: 0.006931471805599453 },
} satisfies ToolExample<
  CapacitorTimeToVoltageInput,
  CapacitorTimeToVoltageOutput
>;

export const calculateCapacitorTimeToVoltage = (
  input: CapacitorTimeToVoltageInput,
): CapacitorTimeToVoltageOutput => {
  if (!(input.resistanceOhms > 0))
    simpleError(
      "resistanceOhms",
      "Resistance must be positive.",
      "invalid_resistance",
    );
  if (!(input.capacitanceF > 0))
    simpleError(
      "capacitanceF",
      "Capacitance must be positive.",
      "invalid_capacitance",
    );
  if (!(input.supplyVolts > 0))
    simpleError(
      "supplyVolts",
      "Supply voltage must be positive.",
      "invalid_supply",
    );
  if (!(input.targetVolts > 0))
    simpleError(
      "targetVolts",
      "Target voltage must be positive.",
      "invalid_target",
    );
  if (input.targetVolts >= input.supplyVolts)
    simpleError(
      "targetVolts",
      "Target voltage must stay below the supply voltage.",
      "unreachable_voltage",
    );
  return {
    timeSeconds:
      -(input.resistanceOhms * input.capacitanceF) *
      Math.log(1 - input.targetVolts / input.supplyVolts),
  };
};

export const capacitorTimeToVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateCapacitorTimeToVoltage(
      input as unknown as CapacitorTimeToVoltageInput,
    ),
  description: "Calculate RC charging time to a target voltage.",
  id: "electronics/capacitor-time-to-voltage",
  inputs: [
    { id: "resistanceOhms", kind: "number", label: "Resistance", unit: "ohm" },
    { id: "capacitanceF", kind: "number", label: "Capacitance", unit: "F" },
    { id: "supplyVolts", kind: "number", label: "Supply voltage", unit: "V" },
    { id: "targetVolts", kind: "number", label: "Target voltage", unit: "V" },
  ],
  outputs: [{ id: "timeSeconds", kind: "number", label: "Time", unit: "s" }],
  title: "RC Time To Threshold",
});
export const runCapacitorTimeToVoltage = capacitorTimeToVoltageTool.execute;
export default capacitorTimeToVoltageTool;
