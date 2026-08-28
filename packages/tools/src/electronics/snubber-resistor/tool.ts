import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SnubberResistorInput = {
  readonly snubberCapacitanceNf: number;
  readonly timeConstantTargetNs: number;
};

export type SnubberResistorOutput = {
  readonly snubberResistorOhms: number;
};

export const snubberResistorExample = {
  input: { snubberCapacitanceNf: 0.47, timeConstantTargetNs: 100 },
  output: { snubberResistorOhms: 212.76595744680853 },
} satisfies ToolExample<SnubberResistorInput, SnubberResistorOutput>;

export const snubberResistorTool = createSimpleTool({
  calculate: (input) => {
    const timeConstantTargetNs = input.timeConstantTargetNs as number;
    const snubberCapacitanceNf = input.snubberCapacitanceNf as number;
    if (!(timeConstantTargetNs > 0))
      simpleError(
        "timeConstantTargetNs",
        "Target time constant must be positive.",
        "invalid_time",
      );
    if (!(snubberCapacitanceNf > 0))
      simpleError(
        "snubberCapacitanceNf",
        "Snubber capacitance must be positive.",
        "invalid_capacitance",
      );
    return {
      snubberResistorOhms: timeConstantTargetNs / snubberCapacitanceNf,
    };
  },
  description:
    "Compute the RC snubber resistor R = tau / C from a target time constant in ns and capacitance in nF.",
  id: "electronics/snubber-resistor",
  inputs: [
    {
      id: "timeConstantTargetNs",
      kind: "number",
      label: "Target time constant",
      unit: "ns",
    },
    {
      id: "snubberCapacitanceNf",
      kind: "number",
      label: "Snubber capacitance",
      unit: "nF",
    },
  ],
  outputs: [
    {
      id: "snubberResistorOhms",
      kind: "number",
      label: "Snubber resistance",
      unit: "ohm",
    },
  ],
  title: "Snubber Resistor Value",
});
export const runSnubberResistor = snubberResistorTool.execute;
export default snubberResistorTool;
