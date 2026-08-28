import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const relativeHumidityExample = {
  input: { actualVaporPressureHpa: 15, saturationVaporPressureHpa: 30 },
} satisfies ToolExample<{
  readonly actualVaporPressureHpa: number;
  readonly saturationVaporPressureHpa: number;
}>;

export const relativeHumidityTool = createSimpleTool({
  id: "chemistry/relative-humidity",
  title: "Relative Humidity Calculator",
  description:
    "Compute relative humidity as the ratio of actual to saturation vapor pressure.",
  inputs: [
    {
      id: "actualVaporPressureHpa",
      label: "Actual vapor pressure",
      kind: "number",
      unit: "hPa",
    },
    {
      id: "saturationVaporPressureHpa",
      label: "Saturation vapor pressure",
      kind: "number",
      unit: "hPa",
    },
  ],
  outputs: [
    {
      id: "relativeHumidityPercent",
      label: "Relative humidity",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const actualVaporPressureHpa = input.actualVaporPressureHpa as number;
    const saturationVaporPressureHpa =
      input.saturationVaporPressureHpa as number;
    if (!(saturationVaporPressureHpa > 0))
      simpleError(
        "saturationVaporPressureHpa",
        "Saturation vapor pressure must be positive.",
      );
    if (
      !(actualVaporPressureHpa >= 0) ||
      actualVaporPressureHpa > saturationVaporPressureHpa
    )
      simpleError(
        "actualVaporPressureHpa",
        "Actual vapor pressure must be between zero and the saturation vapor pressure.",
        "invalid_humidity",
      );
    return {
      relativeHumidityPercent:
        (actualVaporPressureHpa / saturationVaporPressureHpa) * 100,
    };
  },
});
export const runRelativeHumidity = relativeHumidityTool.execute;
export default relativeHumidityTool;
