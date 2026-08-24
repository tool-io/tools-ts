import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrapezoidalIntegrationInput = {
  readonly values?: readonly number[];
  readonly xMin?: number;
  readonly xMax?: number;
};

export type TrapezoidalIntegrationOutput = {
  readonly integral: number;
  readonly deltaX: number;
};

export const calculateTrapezoidalIntegration = (
  input: TrapezoidalIntegrationInput,
): TrapezoidalIntegrationOutput => {
  const values = input.values ?? [0, 0.25, 1, 2.25, 4];
  const xMin = input.xMin ?? 0;
  const xMax = input.xMax ?? 2;
  const count = values.length;
  if (count < 2)
    return simpleError(
      "values",
      "The trapezoidal rule requires at least two samples.",
      "invalid_sample_count",
    );
  if (!(xMax > xMin))
    return simpleError(
      "xMax",
      "xMax must be greater than xMin.",
      "invalid_interval",
    );
  const deltaX = (xMax - xMin) / (count - 1);
  const middleSum = values.slice(1, -1).reduce((sum, y) => sum + y, 0);
  const integral = deltaX * ((values[0] + values[count - 1]) / 2 + middleSum);
  if (!Number.isFinite(integral))
    simpleError("values", "The integral exceeds the numeric range.");
  return { deltaX, integral };
};

export const trapezoidalIntegrationExample = {
  input: {
    values: [0, 0.25, 1, 2.25, 4],
    xMin: 0,
    xMax: 2,
  },
  output: {
    deltaX: 0.5,
    integral: 2.75,
  },
} satisfies ToolExample<
  TrapezoidalIntegrationInput,
  TrapezoidalIntegrationOutput
>;

export const trapezoidalIntegrationTool = createSimpleTool({
  id: "calculus/trapezoidal-integration",
  title: "Trapezoidal Integration Calculator",
  description:
    "Approximate a definite integral from evenly spaced samples over [xMin, xMax] using the composite trapezoidal rule.",
  inputs: [
    {
      description:
        "Function samples at evenly spaced points, first at xMin and last at xMax.",
      default: [0, 0.25, 1, 2.25, 4],
      id: "values",
      kind: "numberList",
      label: "Samples",
    },
    {
      description: "Lower integration bound.",
      default: 0,
      id: "xMin",
      kind: "number",
      label: "xMin",
    },
    {
      description: "Upper integration bound.",
      default: 2,
      id: "xMax",
      kind: "number",
      label: "xMax",
    },
  ],
  outputs: [
    {
      description: "Trapezoidal approximation of the integral.",
      id: "integral",
      kind: "number",
      label: "Integral",
    },
    {
      description: "Sample spacing implied by the bounds.",
      id: "deltaX",
      kind: "number",
      label: "Delta x",
    },
  ],
  calculate: (input) =>
    calculateTrapezoidalIntegration({
      values: input.values as readonly number[],
      xMax: input.xMax as number,
      xMin: input.xMin as number,
    }),
});

export const runTrapezoidalIntegration = trapezoidalIntegrationTool.execute;
export default trapezoidalIntegrationTool;
