import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindChillApparentInput = {
  readonly tempC: number;
  readonly windSpeedKph: number;
};

export type WindChillApparentOutput = {
  readonly apparentTemperatureC: number;
};

export const windChillApparentExample = {
  input: { tempC: -5, windSpeedKph: 30 },
  output: { apparentTemperatureC: -12.996724811921073 },
} satisfies ToolExample<WindChillApparentInput, WindChillApparentOutput>;

export const calculateWindChillApparent = (
  input: WindChillApparentInput,
): WindChillApparentOutput => {
  if (input.tempC > 10)
    simpleError(
      "tempC",
      "Wind chill is only defined for air temperatures at or below ten degrees Celsius.",
      "not_applicable",
    );
  if (input.windSpeedKph < 4.8)
    simpleError(
      "windSpeedKph",
      "Wind chill is only defined for wind speeds of at least four point eight kilometres per hour.",
      "not_applicable",
    );
  const speedFactor = Math.pow(input.windSpeedKph, 0.16);
  return {
    apparentTemperatureC:
      13.12 +
      0.6215 * input.tempC -
      11.37 * speedFactor +
      0.3965 * input.tempC * speedFactor,
  };
};

export const windChillApparentTool = createSimpleTool({
  calculate: (input) =>
    calculateWindChillApparent(input as unknown as WindChillApparentInput),
  description:
    "Compute the wind chill apparent temperature from the standard joint environment committee formula for cold and windy conditions.",
  id: "sailing/wind-chill-apparent",
  inputs: [
    {
      description: "Dry bulb air temperature in degrees Celsius.",
      id: "tempC",
      kind: "number",
      label: "Air temperature",
      unit: "°C",
    },
    {
      description: "Wind speed at ten metres above the surface.",
      format: "speed",
      id: "windSpeedKph",
      kind: "number",
      label: "Wind speed",
      unit: "km/h",
    },
  ],
  outputs: [
    {
      description:
        "Apparent temperature felt on exposed skin due to wind cooling.",
      id: "apparentTemperatureC",
      kind: "number",
      label: "Apparent temperature",
      unit: "°C",
    },
  ],
  title: "Wind Chill Calculator",
});
export const runWindChillApparent = windChillApparentTool.execute;
export default windChillApparentTool;
