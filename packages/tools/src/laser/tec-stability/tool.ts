import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly temperatureSamplesCelsius: readonly number[];
  readonly stabilityLimitMilliKelvin: number;
}>;
export type Output = Readonly<{
  readonly meanTemperatureCelsius: number;
  readonly peakToPeakMilliKelvin: number;
  readonly rmsVariationMilliKelvin: number;
  readonly withinStabilityLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.temperatureSamplesCelsius.length === 0)
    simpleError(
      "temperatureSamplesCelsius",
      "At least one temperature sample is required.",
      "empty_samples",
    );
  const meanTemperatureCelsius =
    input.temperatureSamplesCelsius.reduce((a, b) => a + b, 0) /
    input.temperatureSamplesCelsius.length;
  const peakToPeakMilliKelvin =
    (Math.max(...input.temperatureSamplesCelsius) -
      Math.min(...input.temperatureSamplesCelsius)) *
    1000;
  const rmsVariationMilliKelvin =
    Math.sqrt(
      input.temperatureSamplesCelsius.reduce(
        (sum, value) => sum + (value - meanTemperatureCelsius) ** 2,
        0,
      ) / input.temperatureSamplesCelsius.length,
    ) * 1000;
  return {
    meanTemperatureCelsius,
    peakToPeakMilliKelvin,
    rmsVariationMilliKelvin,
    withinStabilityLimit:
      peakToPeakMilliKelvin <= input.stabilityLimitMilliKelvin,
  };
};

export const exampleInput = {
  temperatureSamplesCelsius: [20, 20.001],
  stabilityLimitMilliKelvin: 2,
} satisfies Input;
export const exampleOutput = {
  meanTemperatureCelsius: 20.000500000000002,
  peakToPeakMilliKelvin: 1.0000000000012221,
  rmsVariationMilliKelvin: 0.5000000000006111,
  withinStabilityLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      temperatureSamplesCelsius:
        input.temperatureSamplesCelsius as readonly number[],
      stabilityLimitMilliKelvin: input.stabilityLimitMilliKelvin as number,
    }),
  description:
    "Measure TEC temperature stability against a caller-supplied millikelvin limit.",
  id: "laser/tec-stability",
  inputs: [
    {
      id: "temperatureSamplesCelsius",
      label: "Temperature samples",
      kind: "numberList",
      unit: "°C",
    },
    {
      id: "stabilityLimitMilliKelvin",
      label: "Caller stability limit",
      kind: "number",
      minimum: 0,
      unit: "mK",
    },
  ],
  outputs: [
    {
      id: "meanTemperatureCelsius",
      label: "Mean temperature",
      kind: "number",
      unit: "°C",
    },
    {
      id: "peakToPeakMilliKelvin",
      label: "Peak-to-peak variation",
      kind: "number",
      minimum: 0,
      unit: "mK",
    },
    {
      id: "rmsVariationMilliKelvin",
      label: "RMS variation",
      kind: "number",
      minimum: 0,
      unit: "mK",
    },
    {
      id: "withinStabilityLimit",
      label: "Within stability limit",
      kind: "boolean",
    },
  ],
  title: "TEC Stability",
});

export const run = tool.execute;
export default tool;
