import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HeatIndexApparentInput = {
  readonly relativeHumidityPercent: number;
  readonly tempC: number;
  readonly windSpeedMs?: number;
};

export type HeatIndexApparentOutput = {
  readonly apparentTemperatureC: number;
};

export const heatIndexApparentExample = {
  input: { relativeHumidityPercent: 70, tempC: 30 },
  output: { apparentTemperatureC: 35.76833429149539 },
} satisfies ToolExample<HeatIndexApparentInput, HeatIndexApparentOutput>;

export const calculateHeatIndexApparent = (
  input: HeatIndexApparentInput,
): HeatIndexApparentOutput => {
  const vapourPressureHpa =
    (input.relativeHumidityPercent / 100) *
    6.105 *
    Math.exp((17.27 * input.tempC) / (237.7 + input.tempC));
  return {
    apparentTemperatureC:
      input.tempC +
      0.33 * vapourPressureHpa -
      0.7 * (input.windSpeedMs ?? 0) -
      4,
  };
};

export const heatIndexApparentTool = createSimpleTool({
  calculate: (input) =>
    calculateHeatIndexApparent(input as unknown as HeatIndexApparentInput),
  description:
    "Compute the simplified apparent temperature from air temperature, humidity-derived vapour pressure, and wind speed. With wind omitted, the result represents still air.",
  id: "sailing/heat-index-apparent",
  inputs: [
    {
      description: "Relative humidity of the air.",
      format: "percent",
      id: "relativeHumidityPercent",
      kind: "number",
      label: "Relative humidity",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Dry bulb air temperature in degrees Celsius.",
      id: "tempC",
      kind: "number",
      label: "Air temperature",
      maximum: 60,
      minimum: -20,
      unit: "°C",
    },
    {
      default: 0,
      description:
        "Wind speed at the observer; stronger wind lowers the result.",
      id: "windSpeedMs",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Apparent temperature combining heat and humidity stress.",
      id: "apparentTemperatureC",
      kind: "number",
      label: "Apparent temperature",
      unit: "°C",
    },
  ],
  title: "Apparent Temperature Calculator",
});
export const runHeatIndexApparent = heatIndexApparentTool.execute;
export default heatIndexApparentTool;
