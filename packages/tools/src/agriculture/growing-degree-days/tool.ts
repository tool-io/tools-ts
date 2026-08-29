import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GrowingDegreeDaysInput = {
  readonly baseTemperature: number;
  readonly dailyHighTemperatures: readonly number[];
  readonly dailyLowTemperatures: readonly number[];
  readonly temperatureUnit: "C" | "F";
  readonly upperTemperature: number;
};

export type GrowingDegreeDaysOutput = {
  readonly dailyDegreeDays: readonly number[];
  readonly degreeDays: number;
  readonly unit: "C-day" | "F-day";
};

export const calculateGrowingDegreeDays = (
  input: GrowingDegreeDaysInput,
): GrowingDegreeDaysOutput => {
  if (!(input.upperTemperature > input.baseTemperature))
    simpleError(
      "upperTemperature",
      "The upper threshold must be greater than the base temperature.",
      "threshold_order_invalid",
    );
  if (
    input.dailyHighTemperatures.length === 0 ||
    input.dailyHighTemperatures.length !== input.dailyLowTemperatures.length
  )
    simpleError(
      "dailyLowTemperatures",
      "High and low temperature lists must have the same nonzero length.",
      "temperature_lists_mismatch",
    );
  const dailyDegreeDays = input.dailyHighTemperatures.map((high, index) => {
    const low = input.dailyLowTemperatures[index]!;
    if (low > high)
      simpleError(
        `dailyLowTemperatures.${index}`,
        "A daily low temperature must not exceed its matching high.",
        "low_above_high",
      );
    const cappedHigh = Math.min(
      Math.max(high, input.baseTemperature),
      input.upperTemperature,
    );
    const cappedLow = Math.min(
      Math.max(low, input.baseTemperature),
      input.upperTemperature,
    );
    return Math.max(0, (cappedHigh + cappedLow) / 2 - input.baseTemperature);
  });
  return {
    dailyDegreeDays,
    degreeDays: dailyDegreeDays.reduce((sum, value) => sum + value, 0),
    unit: input.temperatureUnit === "C" ? "C-day" : "F-day",
  };
};

export const growingDegreeDaysExample = {
  input: {
    baseTemperature: 50,
    dailyHighTemperatures: [80, 60, 45],
    dailyLowTemperatures: [60, 40, 35],
    temperatureUnit: "F" as const,
    upperTemperature: 86,
  },
  output: {
    dailyDegreeDays: [20, 5, 0],
    degreeDays: 25,
    unit: "F-day" as const,
  },
} satisfies ToolExample<GrowingDegreeDaysInput, GrowingDegreeDaysOutput>;

export const growingDegreeDaysTool = createSimpleTool({
  calculate: (input) =>
    calculateGrowingDegreeDays({
      baseTemperature: input.baseTemperature as number,
      dailyHighTemperatures: input.dailyHighTemperatures as number[],
      dailyLowTemperatures: input.dailyLowTemperatures as number[],
      temperatureUnit: input.temperatureUnit as "C" | "F",
      upperTemperature: input.upperTemperature as number,
    }),
  description:
    "Accumulate growing degree days from daily high and low temperatures after clipping both observations to caller-selected lower and upper thresholds.",
  id: "agriculture/growing-degree-days",
  inputs: [
    {
      id: "dailyHighTemperatures",
      kind: "numberList",
      label: "Daily high temperatures",
    },
    {
      id: "dailyLowTemperatures",
      kind: "numberList",
      label: "Daily low temperatures",
    },
    {
      id: "baseTemperature",
      kind: "number",
      label: "Base temperature",
    },
    {
      id: "upperTemperature",
      kind: "number",
      label: "Upper temperature threshold",
    },
    {
      enum: ["C", "F"],
      id: "temperatureUnit",
      kind: "string",
      label: "Temperature unit",
    },
  ],
  outputs: [
    {
      id: "degreeDays",
      kind: "number",
      label: "Growing degree days",
    },
    {
      id: "dailyDegreeDays",
      kind: "numberList",
      label: "Daily degree days",
    },
    {
      enum: ["C-day", "F-day"],
      id: "unit",
      kind: "string",
      label: "Degree-day unit",
    },
  ],
  title: "Growing Degree Days Calculator",
});

export const runGrowingDegreeDays = growingDegreeDaysTool.execute;
export default growingDegreeDaysTool;
