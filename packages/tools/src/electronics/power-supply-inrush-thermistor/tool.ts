import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PowerSupplyInrushThermistorInput = {
  readonly busVolts: number;
  readonly loadResistanceOhms: number;
  readonly ntcColdOhms: number;
};

export type PowerSupplyInrushThermistorOutput = {
  readonly limitedInrushA: number;
};

export const powerSupplyInrushThermistorExample = {
  input: {
    busVolts: 340,
    loadResistanceOhms: 47,
    ntcColdOhms: 10,
  },
  output: { limitedInrushA: 5.964912280701754 },
} satisfies ToolExample<
  PowerSupplyInrushThermistorInput,
  PowerSupplyInrushThermistorOutput
>;

export const calculatePowerSupplyInrushThermistor = (
  input: PowerSupplyInrushThermistorInput,
): PowerSupplyInrushThermistorOutput => {
  if (!(input.ntcColdOhms > 0))
    simpleError(
      "ntcColdOhms",
      "NTC cold resistance must be positive.",
      "invalid_resistance",
    );
  if (!(input.loadResistanceOhms > 0))
    simpleError(
      "loadResistanceOhms",
      "Load resistance must be positive.",
      "invalid_resistance",
    );
  return {
    limitedInrushA:
      input.busVolts / (input.ntcColdOhms + input.loadResistanceOhms),
  };
};

export const powerSupplyInrushThermistorTool = createSimpleTool({
  calculate: (input) =>
    calculatePowerSupplyInrushThermistor(
      input as unknown as PowerSupplyInrushThermistorInput,
    ),
  description:
    "Estimate the peak inrush current of a rectified supply limited by an NTC thermistor in series with the load.",
  id: "electronics/power-supply-inrush-thermistor",
  inputs: [
    {
      description: "Peak DC bus voltage at turn-on.",
      format: "voltage",
      id: "busVolts",
      kind: "number",
      label: "Bus voltage",
      unit: "V",
    },
    {
      description: "Cold (zero-power) resistance of the NTC limiter.",
      format: "resistance",
      id: "ntcColdOhms",
      kind: "number",
      label: "NTC cold resistance",
      unit: "Ω",
    },
    {
      description: "Effective series resistance of the charging load.",
      format: "resistance",
      id: "loadResistanceOhms",
      kind: "number",
      label: "Load resistance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Peak current at the first charging instant.",
      format: "current",
      id: "limitedInrushA",
      kind: "number",
      label: "Limited inrush current",
      unit: "A",
    },
  ],
  title: "Inrush With NTC",
});
export const runPowerSupplyInrushThermistor =
  powerSupplyInrushThermistorTool.execute;
export default powerSupplyInrushThermistorTool;
