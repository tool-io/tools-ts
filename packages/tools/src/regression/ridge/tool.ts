import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RidgeRegressionModel = {
  readonly intercept: number;
  readonly lambda: number;
  readonly predictions: readonly number[];
  readonly slope: number;
};

export const fitRidgeRegression = (
  features: readonly number[],
  targets: readonly number[],
  lambda: number,
): RidgeRegressionModel | null => {
  if (features.length !== targets.length || features.length < 2) return null;
  const featureMean =
    features.reduce((sum, value) => sum + value, 0) / features.length;
  const targetMean =
    targets.reduce((sum, value) => sum + value, 0) / targets.length;
  const covariance = features.reduce(
    (sum, value, index) =>
      sum + (value - featureMean) * ((targets[index] ?? 0) - targetMean),
    0,
  );
  const variance = features.reduce(
    (sum, value) => sum + (value - featureMean) ** 2,
    0,
  );
  if (variance + lambda === 0) return null;
  const slope = covariance / (variance + lambda);
  const intercept = targetMean - slope * featureMean;
  return {
    intercept: Number(intercept.toPrecision(10)),
    lambda,
    predictions: features.map((value) =>
      Number((intercept + slope * value).toPrecision(10)),
    ),
    slope: Number(slope.toPrecision(10)),
  };
};

export const ridgeRegressionExample = {
  input: { features: [1, 2, 3, 4], lambda: 1, targets: [2, 4, 6, 8] },
  output: {
    model: {
      intercept: 0.8333333333,
      lambda: 1,
      predictions: [2.5, 4.166666667, 5.833333333, 7.5],
      slope: 1.666666667,
    },
  },
} satisfies ToolExample<
  {
    readonly features: readonly number[];
    readonly lambda: number;
    readonly targets: readonly number[];
  },
  { readonly model: RidgeRegressionModel }
>;

export const ridgeRegressionTool = createSimpleTool({
  id: "regression/ridge",
  title: "Ridge Regression Demonstrator",
  description:
    "Fit a one-feature ridge regression with an unpenalized intercept.",
  inputs: [
    {
      format: "vector/number",
      id: "features",
      kind: "numberList",
      label: "Feature values",
    },
    {
      format: "vector/number",
      id: "targets",
      kind: "numberList",
      label: "Target values",
    },
    { id: "lambda", kind: "number", label: "Lambda", minimum: 0 },
  ],
  outputs: [
    {
      format: "regression/ridge-model",
      id: "model",
      kind: "object",
      label: "Ridge model",
    },
  ],
  calculate: (input) => {
    const model = fitRidgeRegression(
      input.features as number[],
      input.targets as number[],
      input.lambda as number,
    );
    if (!model)
      return simpleError(
        "features",
        "Enter matching feature and target lists with at least two values.",
      );
    return { model };
  },
});

export const runRidgeRegression = ridgeRegressionTool.execute;
export default ridgeRegressionTool;
