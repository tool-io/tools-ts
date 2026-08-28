import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LedSeriesResistorInput = {
  readonly forwardCurrentA: number;
  readonly forwardVoltageV: number;
  readonly supplyVoltageV: number;
};

export type LedSeriesResistorOutput = {
  readonly resistorOhms: number;
};

export const ledSeriesResistorExample = {
  input: {
    forwardCurrentA: 0.02,
    forwardVoltageV: 2,
    supplyVoltageV: 5,
  },
  output: { resistorOhms: 150 },
} satisfies ToolExample<LedSeriesResistorInput, LedSeriesResistorOutput>;

export const calculateLedSeriesResistor = (
  input: LedSeriesResistorInput,
): LedSeriesResistorOutput => {
  if (input.supplyVoltageV <= input.forwardVoltageV)
    simpleError(
      "supplyVoltageV",
      "The supply voltage must exceed the LED forward voltage.",
      "invalid_input",
    );
  if (input.forwardCurrentA <= 0 || input.forwardVoltageV <= 0)
    simpleError(
      "forwardCurrentA",
      "The forward current and forward voltage must be positive.",
      "invalid_input",
    );
  return {
    resistorOhms:
      (input.supplyVoltageV - input.forwardVoltageV) / input.forwardCurrentA,
  };
};

export const ledSeriesResistorTool = createSimpleTool({
  calculate: (input) =>
    calculateLedSeriesResistor(input as unknown as LedSeriesResistorInput),
  description:
    "Compute the series resistor that sets an LED operating point: R = (Vs - Vf) / I, dissipating the difference between supply and forward voltage.",
  id: "electronics/led-series-resistor",
  inputs: [
    {
      description: "Target continuous forward current of the LED.",
      format: "current-a",
      id: "forwardCurrentA",
      kind: "number",
      label: "Forward current",
      unit: "A",
    },
    {
      description: "Rated forward voltage of the LED at that current.",
      format: "voltage-v",
      id: "forwardVoltageV",
      kind: "number",
      label: "Forward voltage",
      unit: "V",
    },
    {
      description: "Supply voltage feeding the LED plus resistor.",
      format: "voltage-v",
      id: "supplyVoltageV",
      kind: "number",
      label: "Supply voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Required series resistance.",
      format: "resistance",
      id: "resistorOhms",
      kind: "number",
      label: "Series resistor",
      unit: "Ω",
    },
  ],
  title: "LED Series Resistor Calculator",
});
export const runLedSeriesResistor = ledSeriesResistorTool.execute;
export default ledSeriesResistorTool;
