import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly forecastProbabilities: readonly number[];
  readonly outcomes: readonly number[];
}>;
export type Output = Readonly<{
  readonly brierScore: number;
  readonly meanForecastProbability: number;
  readonly observedFrequency: number;
  readonly calibrationGap: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.forecastProbabilities.length;
  if (
    n === 0 ||
    input.outcomes.length !== n ||
    input.forecastProbabilities.some((value) => value < 0 || value > 1) ||
    input.outcomes.some((value) => value !== 0 && value !== 1)
  )
    simpleError(
      "forecastProbabilities",
      "Aligned probabilities and binary outcomes are required.",
      "invalid_forecasts",
    );
  const meanForecastProbability =
      input.forecastProbabilities.reduce((a, b) => a + b, 0) / n,
    observedFrequency = input.outcomes.reduce((a, b) => a + b, 0) / n;
  return {
    brierScore:
      input.forecastProbabilities.reduce(
        (sum, value, index) => sum + (value - input.outcomes[index]) ** 2,
        0,
      ) / n,
    meanForecastProbability,
    observedFrequency,
    calibrationGap: Math.abs(meanForecastProbability - observedFrequency),
  };
};

export const exampleInput = {
  forecastProbabilities: [0.8, 0.2],
  outcomes: [1, 0],
} satisfies Input;
export const exampleOutput = {
  brierScore: 0.039999999999999994,
  meanForecastProbability: 0.5,
  observedFrequency: 0.5,
  calibrationGap: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      forecastProbabilities: input.forecastProbabilities as readonly number[],
      outcomes: input.outcomes as readonly number[],
    }),
  description:
    "Calculate Brier score and calibration gap for binary forecasts.",
  id: "futurology/forecast-calibration",
  inputs: [
    {
      id: "forecastProbabilities",
      label: "Forecast probabilities",
      kind: "numberList",
    },
    { id: "outcomes", label: "Binary outcomes", kind: "numberList" },
  ],
  outputs: [
    {
      id: "brierScore",
      label: "Brier score",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "meanForecastProbability",
      label: "Mean forecast probability",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "observedFrequency",
      label: "Observed event frequency",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "calibrationGap",
      label: "Absolute calibration gap",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "Forecast Calibration",
});

export const run = tool.execute;
export default tool;
