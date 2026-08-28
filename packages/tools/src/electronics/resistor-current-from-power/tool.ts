import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResistorCurrentFromPowerInput = {
  readonly ratedWatts: number;
  readonly resistanceOhms: number;
};

export type ResistorCurrentFromPowerOutput = {
  readonly maxSafeCurrentMa: number;
};

export const resistorCurrentFromPowerExample = {
  input: { ratedWatts: 0.25, resistanceOhms: 100 },
  output: { maxSafeCurrentMa: 50 },
} satisfies ToolExample<
  ResistorCurrentFromPowerInput,
  ResistorCurrentFromPowerOutput
>;

export const calculateResistorCurrentFromPower = (
  input: ResistorCurrentFromPowerInput,
): ResistorCurrentFromPowerOutput => {
  if (!(input.ratedWatts > 0))
    simpleError("ratedWatts", "Rated power must be positive.", "invalid_power");
  if (!(input.resistanceOhms > 0))
    simpleError(
      "resistanceOhms",
      "Resistance must be positive.",
      "invalid_resistance",
    );
  return {
    maxSafeCurrentMa: Math.sqrt(input.ratedWatts / input.resistanceOhms) * 1000,
  };
};

export const resistorCurrentFromPowerTool = createSimpleTool({
  calculate: (input) =>
    calculateResistorCurrentFromPower(
      input as unknown as ResistorCurrentFromPowerInput,
    ),
  description:
    "Compute the maximum safe continuous current in milliamps through a resistor from its power rating and resistance using I = sqrt(P/R).",
  id: "electronics/resistor-current-from-power",
  inputs: [
    {
      description: "Power rating of the resistor.",
      id: "ratedWatts",
      kind: "number",
      label: "Rated power",
      unit: "W",
    },
    {
      description: "Resistance of the resistor.",
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Maximum current before exceeding the power rating.",
      id: "maxSafeCurrentMa",
      kind: "number",
      label: "Max safe current",
      unit: "mA",
    },
  ],
  title: "Current From Power Rating",
});
export const runResistorCurrentFromPower = resistorCurrentFromPowerTool.execute;
export default resistorCurrentFromPowerTool;
