import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChargeOnCapacitorInput = {
  readonly capacitanceF: number;
  readonly resistanceOhms: number;
  readonly supplyVoltageV: number;
  readonly timeS: number;
};

export type ChargeOnCapacitorOutput = {
  readonly chargeC: number;
};

export const chargeOnCapacitorExample = {
  input: {
    capacitanceF: 1e-4,
    resistanceOhms: 1000,
    supplyVoltageV: 9,
    timeS: 0.1,
  },
  output: { chargeC: 0.0005689085029457019 },
} satisfies ToolExample<ChargeOnCapacitorInput, ChargeOnCapacitorOutput>;

export const calculateChargeOnCapacitor = (
  input: ChargeOnCapacitorInput,
): ChargeOnCapacitorOutput => {
  if (input.capacitanceF <= 0 || input.resistanceOhms <= 0)
    simpleError(
      "capacitanceF",
      "Capacitance and resistance must be positive.",
      "invalid_input",
    );
  if (input.timeS < 0 || input.supplyVoltageV < 0)
    simpleError(
      "timeS",
      "Time and supply voltage cannot be negative.",
      "invalid_input",
    );
  return {
    chargeC:
      input.capacitanceF *
      input.supplyVoltageV *
      (1 -
        Math.exp(-input.timeS / (input.resistanceOhms * input.capacitanceF))),
  };
};

export const chargeOnCapacitorTool = createSimpleTool({
  calculate: (input) =>
    calculateChargeOnCapacitor(input as unknown as ChargeOnCapacitorInput),
  description:
    "Compute the RC charging curve q(t) = C * V * (1 - e^(-t / (R * C))) for a capacitor charged through a resistor from a fixed supply.",
  id: "electronics/charge-on-capacitor",
  inputs: [
    {
      description: "Capacitance being charged.",
      id: "capacitanceF",
      kind: "number",
      label: "Capacitance",
      unit: "F",
    },
    {
      description: "Series charging resistance.",
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance",
      unit: "Ω",
    },
    {
      description: "Charging supply voltage.",
      id: "supplyVoltageV",
      kind: "number",
      label: "Supply voltage",
      unit: "V",
    },
    {
      description: "Elapsed charging time.",
      id: "timeS",
      kind: "number",
      label: "Time",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Charge stored on the capacitor at time t.",
      id: "chargeC",
      kind: "number",
      label: "Charge",
      unit: "C",
    },
  ],
  title: "Charge on Capacitor Calculator",
});
export const runChargeOnCapacitor = chargeOnCapacitorTool.execute;
export default chargeOnCapacitorTool;
