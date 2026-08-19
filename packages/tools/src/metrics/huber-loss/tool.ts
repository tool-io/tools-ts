import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type HuberLossInput = {
  readonly delta?: number;
  readonly errors: readonly number[];
};

export type HuberLossOutput = {
  readonly loss: number;
};

export const huberLossExample = {
  input: { delta: 1, errors: [0.5, -2] },
  output: { loss: 0.8125 },
} satisfies ToolExample<HuberLossInput, HuberLossOutput>;

export const calculateHuberLoss = (input: HuberLossInput): HuberLossOutput => {
  const errors = input.errors as readonly number[];
  const delta = input.delta ?? 1;
  if (!(delta > 0))
    simpleError("delta", "Delta must be positive.", "invalid_delta");
  let sum = 0;
  for (const error of errors) {
    const magnitude = Math.abs(error);
    sum +=
      magnitude <= delta
        ? 0.5 * error * error
        : delta * (magnitude - delta / 2);
  }
  return { loss: roundStatistic(sum / errors.length) };
};

export const huberLossTool = createSimpleTool({
  calculate: (input) =>
    calculateHuberLoss(input as unknown as HuberLossInput),
  description:
    "Compute the mean Huber loss, a quadratic-to-linear blend robust to outlier residuals.",
  id: "metrics/huber-loss",
  inputs: [
    {
      description: "Prediction errors or residuals.",
      id: "errors",
      kind: "numberList",
      label: "Errors",
    },
    {
      default: 1,
      description:
        "Threshold where the penalty switches from quadratic to linear.",
      id: "delta",
      kind: "number",
      label: "Delta",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Mean Huber loss over all errors.",
      id: "loss",
      kind: "number",
      label: "Huber loss",
    },
  ],
  title: "Huber Loss Calculator",
});
export const runHuberLoss = huberLossTool.execute;
export default huberLossTool;
