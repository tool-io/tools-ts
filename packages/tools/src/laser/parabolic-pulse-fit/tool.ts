import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly timeCoordinates: readonly number[];
  readonly intensities: readonly number[];
}>;
export type Output = Readonly<{
  readonly quadraticIntercept: number;
  readonly quadraticCoefficient: number;
  readonly rSquared: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.timeCoordinates.length;
  if (n < 2 || input.intensities.length !== n)
    simpleError(
      "timeCoordinates",
      "Time and intensity lists must be aligned with at least two samples.",
      "invalid_samples",
    );
  const x = input.timeCoordinates.map((value) => value * value);
  const mx = x.reduce((a, b) => a + b, 0) / n,
    my = input.intensities.reduce((a, b) => a + b, 0) / n;
  const denominator = x.reduce((sum, value) => sum + (value - mx) ** 2, 0);
  if (denominator === 0)
    simpleError(
      "timeCoordinates",
      "Squared time coordinates need variation.",
      "singular_fit",
    );
  const quadraticCoefficient =
    x.reduce(
      (sum, value, index) =>
        sum + (value - mx) * (input.intensities[index] - my),
      0,
    ) / denominator;
  const quadraticIntercept = my - quadraticCoefficient * mx;
  const residual = input.intensities.reduce(
    (sum, value, index) =>
      sum +
      (value - (quadraticIntercept + quadraticCoefficient * x[index])) ** 2,
    0,
  );
  const total = input.intensities.reduce(
    (sum, value) => sum + (value - my) ** 2,
    0,
  );
  return {
    quadraticIntercept,
    quadraticCoefficient,
    rSquared: total === 0 ? (residual === 0 ? 1 : 0) : 1 - residual / total,
  };
};

export const exampleInput = {
  timeCoordinates: [-1, 0, 1],
  intensities: [0, 1, 0],
} satisfies Input;
export const exampleOutput = {
  quadraticIntercept: 1,
  quadraticCoefficient: -1,
  rSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      timeCoordinates: input.timeCoordinates as readonly number[],
      intensities: input.intensities as readonly number[],
    }),
  description:
    "Fit intensity as a linear function of squared time and report parabolic-fit R squared.",
  id: "laser/parabolic-pulse-fit",
  inputs: [
    { id: "timeCoordinates", label: "Time coordinates", kind: "numberList" },
    { id: "intensities", label: "Measured intensities", kind: "numberList" },
  ],
  outputs: [
    {
      id: "quadraticIntercept",
      label: "Fitted parabolic intercept",
      kind: "number",
    },
    {
      id: "quadraticCoefficient",
      label: "Fitted squared-time coefficient",
      kind: "number",
    },
    { id: "rSquared", label: "Fit R squared", kind: "number", maximum: 1 },
  ],
  title: "Parabolic Pulse Fit",
});

export const run = tool.execute;
export default tool;
