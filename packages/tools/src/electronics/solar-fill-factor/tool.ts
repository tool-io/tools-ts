import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolarFillFactorInput = {
  readonly iscAmps: number;
  readonly maxPowerWatts: number;
  readonly vocVolts: number;
};

export type SolarFillFactorOutput = {
  readonly fillFactor: number;
};

export const solarFillFactorExample = {
  input: { iscAmps: 5.5, maxPowerWatts: 3.1, vocVolts: 0.72 },
  output: { fillFactor: 0.7828282828282829 },
} satisfies ToolExample<SolarFillFactorInput, SolarFillFactorOutput>;

export const calculateSolarFillFactor = (
  input: SolarFillFactorInput,
): SolarFillFactorOutput => {
  if (!(input.vocVolts > 0))
    simpleError(
      "vocVolts",
      "Open-circuit voltage must be positive.",
      "invalid_voltage",
    );
  if (!(input.iscAmps > 0))
    simpleError(
      "iscAmps",
      "Short-circuit current must be positive.",
      "invalid_current",
    );
  if (
    !(input.maxPowerWatts >= 0) ||
    !(input.maxPowerWatts <= input.vocVolts * input.iscAmps)
  )
    simpleError(
      "maxPowerWatts",
      "Maximum power cannot exceed the voc times isc product or be negative.",
      "invalid_power",
    );
  return { fillFactor: input.maxPowerWatts / (input.vocVolts * input.iscAmps) };
};

export const solarFillFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateSolarFillFactor(input as unknown as SolarFillFactorInput),
  description:
    "Compute the fill factor of a photovoltaic cell from maximum power, open-circuit voltage, and short-circuit current.",
  id: "electronics/solar-fill-factor",
  inputs: [
    {
      description: "Maximum power point of the cell.",
      format: "power",
      id: "maxPowerWatts",
      kind: "number",
      label: "Maximum power",
      unit: "W",
    },
    {
      description: "Open-circuit voltage of the cell.",
      format: "voltage",
      id: "vocVolts",
      kind: "number",
      label: "Open-circuit voltage",
      unit: "V",
    },
    {
      description: "Short-circuit current of the cell.",
      format: "current",
      id: "iscAmps",
      kind: "number",
      label: "Short-circuit current",
      unit: "A",
    },
  ],
  outputs: [
    {
      description: "Dimensionless fill factor between zero and one.",
      format: "factor",
      id: "fillFactor",
      kind: "number",
      label: "Fill factor",
    },
  ],
  title: "Solar Fill Factor",
});
export const runSolarFillFactor = solarFillFactorTool.execute;
export default solarFillFactorTool;
