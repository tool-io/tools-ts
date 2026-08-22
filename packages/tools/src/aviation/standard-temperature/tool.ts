import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type StandardTemperatureInput = {
  readonly altitudeFt: number;
};

export type StandardTemperatureOutput = {
  readonly standardTemperatureC: number;
};

/** ISA sea-level temperature, lapse rate per foot, and stratosphere plateau. */
const ISA_SEA_LEVEL_C = 15;
const ISA_LAPSE_C_PER_FT = 0.0019812;
const TROPOPAUSE_FT = 36_089.24;
const STRATOSPHERE_C = -56.5;

export const standardTemperatureExample = {
  input: { altitudeFt: 5000 },
  output: { standardTemperatureC: 5.094 },
} satisfies ToolExample<StandardTemperatureInput, StandardTemperatureOutput>;

export const calculateStandardTemperature = (
  input: StandardTemperatureInput,
): StandardTemperatureOutput => {
  if (input.altitudeFt < 0)
    simpleError(
      "altitudeFt",
      "The altitude cannot be negative.",
      "invalid_altitude",
    );
  return {
    standardTemperatureC: roundStatistic(
      input.altitudeFt > TROPOPAUSE_FT
        ? STRATOSPHERE_C
        : ISA_SEA_LEVEL_C - ISA_LAPSE_C_PER_FT * input.altitudeFt,
    ),
  };
};

export const standardTemperatureTool = createSimpleTool({
  calculate: (input) =>
    calculateStandardTemperature(input as unknown as StandardTemperatureInput),
  description:
    "Compute the ISA standard temperature for a given altitude in the troposphere.",
  id: "aviation/standard-temperature",
  inputs: [
    {
      description: "Altitude within the troposphere (up to about 36,089 ft).",
      id: "altitudeFt",
      kind: "number",
      label: "Altitude",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "ISA standard temperature.",
      format: "temperature-c",
      id: "standardTemperatureC",
      kind: "number",
      label: "ISA temperature",
      unit: "°C",
    },
  ],
  title: "ISA Standard Temperature Calculator",
});
export const runStandardTemperature = standardTemperatureTool.execute;
export default standardTemperatureTool;
