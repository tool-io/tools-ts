import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeatingDegreeDaysInput = {
  readonly baseTemperature: number;
  readonly dailyHighTemperatures: readonly number[];
  readonly dailyLowTemperatures: readonly number[];
  readonly temperatureUnit: "C" | "F";
};

export type HeatingDegreeDaysOutput = {
  readonly dailyDegreeDays: readonly number[];
  readonly degreeDays: number;
  readonly unit: "C-day" | "F-day";
};

export const calculateHeatingDegreeDays = (
  input: HeatingDegreeDaysInput,
): HeatingDegreeDaysOutput => {
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
    return Math.max(0, input.baseTemperature - (high + low) / 2);
  });
  return {
    dailyDegreeDays,
    degreeDays: dailyDegreeDays.reduce((sum, value) => sum + value, 0),
    unit: input.temperatureUnit === "C" ? "C-day" : "F-day",
  };
};

export const heatingDegreeDaysExample = {
  input: {
    baseTemperature: 65,
    dailyHighTemperatures: [33, 70, 60],
    dailyLowTemperatures: [25, 60, 50],
    temperatureUnit: "F" as const,
  },
  output: {
    dailyDegreeDays: [36, 0, 10],
    degreeDays: 46,
    unit: "F-day" as const,
  },
} satisfies ToolExample<HeatingDegreeDaysInput, HeatingDegreeDaysOutput>;

export const heatingDegreeDaysTool = createSimpleTool({
  calculate: (input) =>
    calculateHeatingDegreeDays({
      baseTemperature: input.baseTemperature as number,
      dailyHighTemperatures: input.dailyHighTemperatures as number[],
      dailyLowTemperatures: input.dailyLowTemperatures as number[],
      temperatureUnit: input.temperatureUnit as "C" | "F",
    }),
  description:
    "Sum daily heating degree days as max(base − (high + low) / 2, 0) without rounding daily means.",
  id: "meteorology/heating-degree-days",
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
      label: "Heating degree days",
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
  title: "Heating Degree Days Calculator",
});

export const runHeatingDegreeDays = heatingDegreeDaysTool.execute;
export default heatingDegreeDaysTool;
