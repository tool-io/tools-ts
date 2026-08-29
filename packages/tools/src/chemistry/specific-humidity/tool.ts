import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const specificHumidityExample = {
  input: { pressureHpa: 1013.25, vaporPressureHpa: 20 },
} satisfies ToolExample<{
  readonly pressureHpa: number;
  readonly vaporPressureHpa: number;
}>;

export const specificHumidityTool = createSimpleTool({
  id: "chemistry/specific-humidity",
  title: "Specific Humidity Calculator",
  description:
    "Compute the specific humidity in grams of water vapor per kilogram of moist air.",
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
      id: "specificHumidityGPerKg",
      label: "Specific humidity",
      kind: "number",
      unit: "g/kg",
    },
  ],
  calculate: (input) => {
    const vaporPressureHpa = input.vaporPressureHpa as number;
    const pressureHpa = input.pressureHpa as number;
    if (!(pressureHpa - 0.378 * vaporPressureHpa > 0))
      simpleError(
        "vaporPressureHpa",
        "Vapor pressure must be below the total pressure.",
      );
    return {
      specificHumidityGPerKg:
        (622 * vaporPressureHpa) / (pressureHpa - 0.378 * vaporPressureHpa),
    };
  },
});
export const runSpecificHumidity = specificHumidityTool.execute;
export default specificHumidityTool;
