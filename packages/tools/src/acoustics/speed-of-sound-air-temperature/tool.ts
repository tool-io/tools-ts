import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpeedOfSoundAirTemperatureInput = Readonly<{
  readonly temperatureCelsius: number;
}>;
export type SpeedOfSoundAirTemperatureOutput = Readonly<{
  readonly metersPerSecond: number;
}>;

export const calculateSpeedOfSoundAirTemperature = (
  x: SpeedOfSoundAirTemperatureInput,
): SpeedOfSoundAirTemperatureOutput => {
  if (!Number.isFinite(x.temperatureCelsius))
    simpleError("temperatureCelsius", "Provide a finite number.");
  if (!(x.temperatureCelsius >= -30 && x.temperatureCelsius <= 50))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const metersPerSecond = 331.3 + 0.606 * x.temperatureCelsius;
  if (!Number.isFinite(metersPerSecond))
    simpleError(
      "metersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    metersPerSecond: Object.is(metersPerSecond, -0) ? 0 : metersPerSecond,
  };
};

export const example = {
  input: {
    temperatureCelsius: 20,
  },
  output: { metersPerSecond: 343.42 },
} satisfies ToolExample<
  SpeedOfSoundAirTemperatureInput,
  SpeedOfSoundAirTemperatureOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/speed-of-sound-air-temperature",
  title: "Speed Of Sound Air Temperature",
  description:
    "Approximate dry-air sound speed in m/s from Celsius temperature using 331.3+0.606T; intended for ordinary ambient conditions.",
  inputs: [
    {
      id: "temperatureCelsius",
      kind: "number",
      label: "Temperature Celsius",
      unit: "C",
    },
  ],
  outputs: [
    {
      id: "metersPerSecond",
      kind: "number",
      label: "Meters Per Second",
      unit: "m/s",
    },
  ],
  calculate: (input) =>
    calculateSpeedOfSoundAirTemperature({
      temperatureCelsius: input.temperatureCelsius as number,
    }),
});
export const speedOfSoundAirTemperatureTool = tool;
export const runSpeedOfSoundAirTemperature = tool.execute;
export default tool;
