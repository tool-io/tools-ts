import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type SpeedOfSoundInput = {
  readonly oatC: number;
};

export type SpeedOfSoundOutput = {
  readonly speedOfSoundKt: number;
};

const ISA_SEA_LEVEL_TEMPERATURE_K = 288.15;
/** Speed of sound at ISA sea level, in knots. */
const ISA_SEA_LEVEL_SPEED_KT = 661.478848;

export const speedOfSoundExample = {
  input: { oatC: 15 },
  output: { speedOfSoundKt: 661.478848 },
} satisfies ToolExample<SpeedOfSoundInput, SpeedOfSoundOutput>;

export const calculateSpeedOfSound = (
  input: SpeedOfSoundInput,
): SpeedOfSoundOutput => {
  const temperatureK = (input.oatC as number) + 273.15;
  if (temperatureK <= 0)
    simpleError(
      "oatC",
      "Temperature must be above absolute zero.",
      "invalid_temperature",
    );
  return {
    speedOfSoundKt: roundStatistic(
      ISA_SEA_LEVEL_SPEED_KT * Math.sqrt(temperatureK / ISA_SEA_LEVEL_TEMPERATURE_K),
    ),
  };
};

export const speedOfSoundTool = createSimpleTool({
  calculate: (input) =>
    calculateSpeedOfSound(input as unknown as SpeedOfSoundInput),
  description:
    "Compute the local speed of sound from the outside air temperature.",
  id: "aviation/speed-of-sound",
  inputs: [
    {
      description: "Outside air temperature.",
      id: "oatC",
      kind: "number",
      label: "OAT",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "Local speed of sound.",
      format: "speed",
      id: "speedOfSoundKt",
      kind: "number",
      label: "Speed of sound",
      unit: "kt",
    },
  ],
  title: "Speed of Sound Calculator",
});
export const runSpeedOfSound = speedOfSoundTool.execute;
export default speedOfSoundTool;
