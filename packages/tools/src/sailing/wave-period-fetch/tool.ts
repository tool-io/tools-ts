import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WavePeriodFetchInput = {
  fetchNauticalMiles: number;
  windSpeedKt: number;
};

export type WavePeriodFetchOutput = {
  periodSeconds: number;
};

export const wavePeriodFetchExample = {
  input: { fetchNauticalMiles: 100, windSpeedKt: 20 },
  output: { periodSeconds: 5.593254033368065 },
} satisfies ToolExample<WavePeriodFetchInput, WavePeriodFetchOutput>;

export const calculateWavePeriodFetch = (
  input: WavePeriodFetchInput,
): WavePeriodFetchOutput => {
  if (input.fetchNauticalMiles <= 0)
    simpleError(
      "fetchNauticalMiles",
      "Fetch must be positive.",
      "invalid_input",
    );
  if (input.windSpeedKt <= 0)
    simpleError("windSpeedKt", "Wind speed must be positive.", "invalid_input");
  const gravity = 9.80665;
  const windSpeedMs = input.windSpeedKt * 0.514444;
  const fetchMeters = input.fetchNauticalMiles * 1852;
  const dimensionlessFetch = (gravity * fetchMeters) / windSpeedMs ** 2;
  return {
    periodSeconds:
      7.54 *
      (windSpeedMs / gravity) *
      Math.tanh(0.077 * dimensionlessFetch ** 0.25),
  };
};

export const wavePeriodFetchTool = createSimpleTool({
  calculate: (input) =>
    calculateWavePeriodFetch(input as unknown as WavePeriodFetchInput),
  description:
    "Estimate the peak period of fetch-limited deep-water waves from wind speed and unobstructed fetch using the dimensionless SMB growth relation.",
  id: "sailing/wave-period-fetch",
  inputs: [
    {
      description: "Unobstructed fetch over which waves build.",
      id: "fetchNauticalMiles",
      kind: "number",
      label: "Fetch",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Sustained wind speed over the fetch.",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Estimated dominant wave period.",
      format: "duration-s",
      id: "periodSeconds",
      kind: "number",
      label: "Wave period",
      unit: "s",
    },
  ],
  title: "Wave Period Estimate",
});
export const runWavePeriodFetch = wavePeriodFetchTool.execute;
export default wavePeriodFetchTool;
