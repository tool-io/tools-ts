import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LinearInput = {
  readonly x: readonly number[];
  readonly y: readonly number[];
};

export type LinearOutput = {
  readonly intercept: number;
  readonly rSquared: number;
  readonly slope: number;
};

export const calculateLinear = (input: LinearInput): LinearOutput => {
  if (input.x.length !== input.y.length)
    return simpleError(
      "y",
      "x and y must have the same length.",
      "mismatched_lengths",
    );
  if (input.x.length < 2)
    return simpleError(
      "x",
      "Provide at least two paired observations.",
      "insufficient_points",
    );
  if (input.x.every((value) => value === input.x[0]))
    return simpleError("x", "The predictor values must vary.", "constant_x");
  const count = input.x.length;
  const meanX = input.x.reduce((sum, value) => sum + value, 0) / count;
  const meanY = input.y.reduce((sum, value) => sum + value, 0) / count;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let index = 0; index < count; index += 1) {
    sxx += (input.x[index]! - meanX) ** 2;
    sxy += (input.x[index]! - meanX) * (input.y[index]! - meanY);
    syy += (input.y[index]! - meanY) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  const round12 = (value: number): number => Number(value.toPrecision(12));
  return {
    intercept: round12(intercept),
    rSquared: syy === 0 ? 1 : round12((sxy * sxy) / (sxx * syy)),
    slope: round12(slope),
  };
};

export const linearExample = {
  input: {
    x: [1, 2, 3, 4, 5],
    y: [2, 4, 5, 4, 5],
  },
  output: {
    intercept: 2.2,
    rSquared: 0.6,
    slope: 0.6,
  },
} satisfies ToolExample<LinearInput, LinearOutput>;

export const linearTool = createSimpleTool({
  id: "regression/linear",
  title: "Linear Regression Calculator",
  description:
    "Fit an ordinary least-squares line to paired samples and report slope, intercept, and R squared.",
  inputs: [
    {
      description: "Predictor observations.",
      id: "x",
      kind: "numberList",
      label: "X values",
    },
    {
      description: "Response observations aligned with the predictor values.",
      id: "y",
      kind: "numberList",
      label: "Y values",
    },
  ],
  outputs: [
    {
      description: "Fitted value of y when x is zero.",
      id: "intercept",
      kind: "number",
      label: "Intercept",
    },
    {
      description:
        "Fraction of response variance explained by the fitted line.",
      id: "rSquared",
      kind: "number",
      label: "R squared",
    },
    {
      description: "Fitted change in y per unit change in x.",
      id: "slope",
      kind: "number",
      label: "Slope",
    },
  ],
  calculate: (input) =>
    calculateLinear({
      x: input.x as readonly number[],
      y: input.y as readonly number[],
    }),
});

export const runLinear = linearTool.execute;
export default linearTool;
