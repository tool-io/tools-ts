import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly rainfallSeries: readonly number[];
  readonly incidenceSeries: readonly number[];
  readonly maximumLagWeeks: number;
}>;
export type Output = Readonly<{
  readonly bestLagWeeks: number;
  readonly maximumCorrelation: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.rainfallSeries, input.incidenceSeries, "rainfallSeries");
  input.rainfallSeries.forEach((v) => nonnegative(v, "rainfallSeries"));
  input.incidenceSeries.forEach((v) => nonnegative(v, "incidenceSeries"));
  count(input.maximumLagWeeks, "maximumLagWeeks");
  if (
    input.maximumLagWeeks > 52 ||
    input.maximumLagWeeks > input.rainfallSeries.length - 3
  )
    simpleError(
      "maximumLagWeeks",
      "Lag must leave at least three paired weeks and not exceed 52.",
    );
  let bestLagWeeks = -1,
    maximumCorrelation = -2;
  for (let lag = 0; lag <= input.maximumLagWeeks; lag++) {
    const x = input.rainfallSeries.slice(0, input.rainfallSeries.length - lag),
      y = input.incidenceSeries.slice(lag),
      a = x.reduce((s, v) => s + v, 0) / x.length,
      b = y.reduce((s, v) => s + v, 0) / y.length,
      xx = x.reduce((s, v) => s + (v - a) ** 2, 0),
      yy = y.reduce((s, v) => s + (v - b) ** 2, 0);
    if (xx === 0 || yy === 0) continue;
    const correlation =
      x.reduce((s, v, i) => s + (v - a) * (y[i] - b), 0) / Math.sqrt(xx * yy);
    if (correlation > maximumCorrelation) {
      bestLagWeeks = lag;
      maximumCorrelation = correlation;
    }
  }
  if (bestLagWeeks < 0)
    simpleError(
      "rainfallSeries",
      "Correlation is undefined for constant paired data.",
    );
  return {
    bestLagWeeks,
    maximumCorrelation: Math.max(-1, Math.min(1, maximumCorrelation)),
  };
};
export const exampleInput = {
  rainfallSeries: [0, 1, 0, 2, 0],
  incidenceSeries: [0, 0, 1, 0, 2],
  maximumLagWeeks: 1,
} satisfies Input;
export const exampleOutput = {
  bestLagWeeks: 1,
  maximumCorrelation: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/rainfall-incidence-lag",
  title: "Rainfall Incidence Lag",
  description:
    "Find the nonnegative rainfall-to-incidence lag with greatest paired Pearson correlation; not a causal estimate.",
  inputs: [
    { id: "rainfallSeries", label: "Rainfall series", kind: "numberList" },
    { id: "incidenceSeries", label: "Incidence series", kind: "numberList" },
    { id: "maximumLagWeeks", label: "Maximum lag weeks", kind: "integer" },
  ],
  outputs: [
    { id: "bestLagWeeks", label: "Best lag weeks", kind: "number" },
    { id: "maximumCorrelation", label: "Maximum correlation", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      rainfallSeries: value.rainfallSeries as readonly number[],
      incidenceSeries: value.incidenceSeries as readonly number[],
      maximumLagWeeks: value.maximumLagWeeks as number,
    }),
});
export const run = tool.execute;
export default tool;
