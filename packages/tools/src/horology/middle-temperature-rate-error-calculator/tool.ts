import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MiddleTemperatureErrorInput = {
  readonly highRateSecondsPerDay: number;
  readonly highTemperatureCelsius: number;
  readonly lowRateSecondsPerDay: number;
  readonly lowTemperatureCelsius: number;
  readonly middleRateSecondsPerDay: number;
  readonly middleTemperatureCelsius: number;
};

export type MiddleTemperatureErrorOutput = {
  readonly linearMiddleRateSecondsPerDay: number;
  readonly middleTemperatureErrorSecondsPerDay: number;
  readonly observedMiddleRateSecondsPerDay: number;
  readonly profile: "gainAtMiddle" | "lossAtMiddle" | "zeroMiddleError";
  readonly rateChangeHighToMiddleSecondsPerDay: number;
  readonly rateChangeLowToMiddleSecondsPerDay: number;
};

export const calculateMiddleTemperatureError = (
  input: MiddleTemperatureErrorInput,
): MiddleTemperatureErrorOutput => {
  if (
    !Number.isFinite(input.lowTemperatureCelsius) ||
    !Number.isFinite(input.middleTemperatureCelsius) ||
    !Number.isFinite(input.highTemperatureCelsius)
  )
    simpleError("", "All temperatures must be finite.", "temperature_invalid");
  if (
    input.middleTemperatureCelsius <= input.lowTemperatureCelsius ||
    input.highTemperatureCelsius <= input.middleTemperatureCelsius
  )
    simpleError(
      "",
      "Temperatures must satisfy low < middle < high.",
      "temperatures_not_ascending",
    );
  if (
    !Number.isFinite(input.lowRateSecondsPerDay) ||
    !Number.isFinite(input.middleRateSecondsPerDay) ||
    !Number.isFinite(input.highRateSecondsPerDay)
  )
    simpleError("", "All daily rates must be finite.", "rate_invalid");
  const fraction =
    (input.middleTemperatureCelsius - input.lowTemperatureCelsius) /
    (input.highTemperatureCelsius - input.lowTemperatureCelsius);
  const linearMiddleRateSecondsPerDay =
    input.lowRateSecondsPerDay +
    fraction * (input.highRateSecondsPerDay - input.lowRateSecondsPerDay);
  const middleTemperatureErrorSecondsPerDay =
    input.middleRateSecondsPerDay - linearMiddleRateSecondsPerDay;
  return {
    linearMiddleRateSecondsPerDay,
    middleTemperatureErrorSecondsPerDay,
    observedMiddleRateSecondsPerDay: input.middleRateSecondsPerDay,
    profile:
      middleTemperatureErrorSecondsPerDay > 0
        ? "gainAtMiddle"
        : middleTemperatureErrorSecondsPerDay < 0
          ? "lossAtMiddle"
          : "zeroMiddleError",
    rateChangeHighToMiddleSecondsPerDay:
      input.highRateSecondsPerDay - input.middleRateSecondsPerDay,
    rateChangeLowToMiddleSecondsPerDay:
      input.middleRateSecondsPerDay - input.lowRateSecondsPerDay,
  };
};

export const middleTemperatureErrorExample = {
  input: {
    highRateSecondsPerDay: 0,
    highTemperatureCelsius: 38,
    lowRateSecondsPerDay: 0,
    lowTemperatureCelsius: 8,
    middleRateSecondsPerDay: 2,
    middleTemperatureCelsius: 23,
  },
  output: {
    linearMiddleRateSecondsPerDay: 0,
    middleTemperatureErrorSecondsPerDay: 2,
    observedMiddleRateSecondsPerDay: 2,
    profile: "gainAtMiddle",
    rateChangeHighToMiddleSecondsPerDay: -2,
    rateChangeLowToMiddleSecondsPerDay: 2,
  },
} satisfies ToolExample<
  MiddleTemperatureErrorInput,
  MiddleTemperatureErrorOutput
>;

export const middleTemperatureErrorTool = createSimpleTool({
  calculate: (input) =>
    calculateMiddleTemperatureError({
      highRateSecondsPerDay: input.highRateSecondsPerDay as number,
      highTemperatureCelsius: input.highTemperatureCelsius as number,
      lowRateSecondsPerDay: input.lowRateSecondsPerDay as number,
      lowTemperatureCelsius: input.lowTemperatureCelsius as number,
      middleRateSecondsPerDay: input.middleRateSecondsPerDay as number,
      middleTemperatureCelsius: input.middleTemperatureCelsius as number,
    }),
  description:
    "Calculate the middle-temperature departure from the straight line between caller-supplied low- and high-temperature daily rates.",
  id: "horology/middle-temperature-rate-error-calculator",
  inputs: [
    {
      id: "highRateSecondsPerDay",
      kind: "number",
      label: "High-temperature daily rate",
      unit: "s/day",
    },
    {
      id: "highTemperatureCelsius",
      kind: "number",
      label: "High temperature",
      unit: "degC",
    },
    {
      id: "lowRateSecondsPerDay",
      kind: "number",
      label: "Low-temperature daily rate",
      unit: "s/day",
    },
    {
      id: "lowTemperatureCelsius",
      kind: "number",
      label: "Low temperature",
      unit: "degC",
    },
    {
      id: "middleRateSecondsPerDay",
      kind: "number",
      label: "Middle-temperature daily rate",
      unit: "s/day",
    },
    {
      id: "middleTemperatureCelsius",
      kind: "number",
      label: "Middle temperature",
      unit: "degC",
    },
  ],
  outputs: [
    {
      id: "linearMiddleRateSecondsPerDay",
      kind: "number",
      label: "Linearly interpolated middle rate",
      unit: "s/day",
    },
    {
      id: "middleTemperatureErrorSecondsPerDay",
      kind: "number",
      label: "Middle-temperature error",
      unit: "s/day",
    },
    {
      id: "observedMiddleRateSecondsPerDay",
      kind: "number",
      label: "Observed middle rate",
      unit: "s/day",
    },
    {
      enum: ["gainAtMiddle", "lossAtMiddle", "zeroMiddleError"],
      id: "profile",
      kind: "string",
      label: "Middle-temperature profile",
    },
    {
      id: "rateChangeHighToMiddleSecondsPerDay",
      kind: "number",
      label: "High-to-middle rate change",
      unit: "s/day",
    },
    {
      id: "rateChangeLowToMiddleSecondsPerDay",
      kind: "number",
      label: "Low-to-middle rate change",
      unit: "s/day",
    },
  ],
  title: "Middle Temperature Rate Error Calculator",
});

export const runMiddleTemperatureError = middleTemperatureErrorTool.execute;
export default middleTemperatureErrorTool;
