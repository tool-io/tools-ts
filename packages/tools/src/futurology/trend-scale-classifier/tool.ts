import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly durationYears: number;
  readonly marketsReached: number;
  readonly minimumTrendYears: number;
  readonly minimumMegatrendMarkets: number;
}>;
export type Output = Readonly<{
  readonly classification: string;
}>;

export const calculate = (input: Input): Output => {
  const classification =
    input.durationYears < input.minimumTrendYears
      ? "fad"
      : input.marketsReached >= input.minimumMegatrendMarkets
        ? "megatrend"
        : "trend";
  return { classification };
};

export const exampleInput = {
  durationYears: 8,
  marketsReached: 6,
  minimumTrendYears: 3,
  minimumMegatrendMarkets: 5,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  durationYears: 1,
  marketsReached: 10,
  minimumTrendYears: 3,
  minimumMegatrendMarkets: 5,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      durationYears: input.durationYears as number,
      marketsReached: input.marketsReached as number,
      minimumTrendYears: input.minimumTrendYears as number,
      minimumMegatrendMarkets: input.minimumMegatrendMarkets as number,
    }),
  description:
    "Classify an observed signal with caller-defined duration and reach thresholds.",
  id: "futurology/trend-scale-classifier",
  inputs: [
    {
      id: "durationYears",
      label: "Observed duration",
      kind: "number",
      minimum: 0,
      unit: "years",
    },
    {
      id: "marketsReached",
      label: "Markets reached",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "minimumTrendYears",
      label: "Minimum trend duration",
      kind: "number",
      minimum: 0,
      unit: "years",
    },
    {
      id: "minimumMegatrendMarkets",
      label: "Minimum megatrend reach",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "classification",
      label: "Scale classification",
      kind: "string",
      enum: ["fad", "trend", "megatrend"],
    },
  ],
  title: "Trend Scale Classifier",
});

export const run = tool.execute;
export default tool;
