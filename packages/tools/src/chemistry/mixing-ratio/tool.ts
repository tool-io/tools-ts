import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const mixingRatioExample = {
  input: { pressureHpa: 1013.25, vaporPressureHpa: 20 },
} satisfies ToolExample<{
  readonly pressureHpa: number;
  readonly vaporPressureHpa: number;
}>;

export const mixingRatioTool = createSimpleTool({
  id: "chemistry/mixing-ratio",
  title: "Mixing Ratio Calculator",
  description:
    "Compute the water vapor mass mixing ratio in grams per kilogram of dry air.",
  inputs: [
    {
      id: "vaporPressureHpa",
      label: "Vapor pressure",
      kind: "number",
      unit: "hPa",
    },
    {
      id: "pressureHpa",
      label: "Total pressure",
      kind: "number",
      unit: "hPa",
    },
  ],
  outputs: [
    {
      id: "mixingRatioGPerKg",
      label: "Mixing ratio",
      kind: "number",
      unit: "g/kg",
    },
  ],
  calculate: (input) => {
    const vaporPressureHpa = input.vaporPressureHpa as number;
    const pressureHpa = input.pressureHpa as number;
    if (!(vaporPressureHpa < pressureHpa))
      simpleError(
        "vaporPressureHpa",
        "Vapor pressure must be less than total pressure.",
      );
    return {
      mixingRatioGPerKg:
        (622 * vaporPressureHpa) / (pressureHpa - vaporPressureHpa),
    };
  },
});
export const runMixingRatio = mixingRatioTool.execute;
export default mixingRatioTool;
