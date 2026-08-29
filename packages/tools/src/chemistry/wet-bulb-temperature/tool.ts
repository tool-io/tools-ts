import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const wetBulbTemperatureExample = {
  input: { relativeHumidityPercent: 70, temperatureC: 30 },
} satisfies ToolExample<{
  readonly relativeHumidityPercent: number;
  readonly temperatureC: number;
}>;

export const wetBulbTemperatureTool = createSimpleTool({
  id: "chemistry/wet-bulb-temperature",
  title: "Wet Bulb Approximation",
  description:
    "Approximate wet bulb temperature from air temperature and relative humidity using the Stull formula.",
  inputs: [
    {
      id: "temperatureC",
      label: "Air temperature",
      kind: "number",
      maximum: 50,
      minimum: -20,
      unit: "\u00B0C",
    },
    {
      id: "relativeHumidityPercent",
      label: "Relative humidity",
      kind: "number",
      maximum: 100,
      minimum: 5,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "wetBulbCelsius",
      label: "Wet bulb temperature",
      kind: "number",
      unit: "\u00B0C",
    },
  ],
  calculate: (input) => {
    const temperatureC = input.temperatureC as number;
    const relativeHumidityPercent = input.relativeHumidityPercent as number;
    return {
      wetBulbCelsius:
        temperatureC *
          Math.atan(0.151977 * Math.sqrt(relativeHumidityPercent + 8.313659)) +
        Math.atan(temperatureC + relativeHumidityPercent) -
        Math.atan(relativeHumidityPercent - 1.676331) +
        0.00391838 *
          Math.pow(relativeHumidityPercent, 1.5) *
          Math.atan(0.023101 * relativeHumidityPercent) -
        4.686035,
    };
  },
});
export const runWetBulbTemperature = wetBulbTemperatureTool.execute;
export default wetBulbTemperatureTool;
