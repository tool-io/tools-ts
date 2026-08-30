import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly timesPicoseconds: readonly number[];
  readonly signals: readonly number[];
}>;
export type Output = Readonly<{
  readonly lifetimePicoseconds: number;
  readonly initialAmplitude: number;
  readonly rSquared: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.timesPicoseconds.length;
  if (
    n < 2 ||
    input.signals.length !== n ||
    input.signals.some((value) => value <= 0)
  )
    simpleError(
      "timesPicoseconds",
      "Aligned times and positive signals need at least two samples.",
      "invalid_samples",
    );
  const y = input.signals.map(Math.log);
  const mx = input.timesPicoseconds.reduce((a, b) => a + b, 0) / n,
    my = y.reduce((a, b) => a + b, 0) / n;
  const denominator = input.timesPicoseconds.reduce(
    (sum, value) => sum + (value - mx) ** 2,
    0,
  );
  if (denominator === 0)
    simpleError("timesPicoseconds", "Times need variation.", "singular_fit");
  const slope =
    input.timesPicoseconds.reduce(
      (sum, value, index) => sum + (value - mx) * (y[index] - my),
      0,
    ) / denominator;
  if (slope >= 0)
    simpleError(
      "signals",
      "Fit does not represent a decaying exponential.",
      "nondecaying_fit",
    );
  const intercept = my - slope * mx;
  const residual = y.reduce(
    (sum, value, index) =>
      sum + (value - (intercept + slope * input.timesPicoseconds[index])) ** 2,
    0,
  );
  const total = y.reduce((sum, value) => sum + (value - my) ** 2, 0);
  return {
    lifetimePicoseconds: -1 / slope,
    initialAmplitude: Math.exp(intercept),
    rSquared: total === 0 ? 1 : 1 - residual / total,
  };
};

export const exampleInput = {
  timesPicoseconds: [0, 1, 2],
  signals: [1, 0.36787944117144233, 0.1353352832366127],
} satisfies Input;
export const exampleOutput = {
  lifetimePicoseconds: 1,
  initialAmplitude: 1,
  rSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      timesPicoseconds: input.timesPicoseconds as readonly number[],
      signals: input.signals as readonly number[],
    }),
  description:
    "Fit a positive transient-absorption trace to a single exponential using log-linear regression.",
  id: "laser/transient-absorption-lifetime-fit",
  inputs: [
    {
      id: "timesPicoseconds",
      label: "Delay times",
      kind: "numberList",
      unit: "ps",
    },
    {
      id: "signals",
      label: "Transient-absorption signals",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "lifetimePicoseconds",
      label: "Exponential lifetime",
      kind: "number",
      minimum: 0,
      unit: "ps",
    },
    {
      id: "initialAmplitude",
      label: "Fitted initial amplitude",
      kind: "number",
      minimum: 0,
    },
    {
      id: "rSquared",
      label: "Log-linear fit R squared",
      kind: "number",
      maximum: 1,
    },
  ],
  title: "Transient-Absorption Lifetime Fit",
});

export const run = tool.execute;
export default tool;
