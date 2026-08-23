import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type StopLossNormalApproximationInput = {
  readonly attachmentPoint: number;
  readonly expectedAggregateLoss: number;
  readonly aggregateLossStdDev: number;
};

export type StopLossNormalApproximationOutput = {
  readonly expectedStopLossCost: number;
};

export const stopLossNormalApproximationExample = {
  input: {
    attachmentPoint: 110,
    aggregateLossStdDev: 10,
    expectedAggregateLoss: 100,
  },
  output: {
    expectedStopLossCost: 0.83315464956,
  },
} satisfies ToolExample<
  StopLossNormalApproximationInput,
  StopLossNormalApproximationOutput
>;

const standardNormalPdf = (z: number): number =>
  Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

const standardNormalCdf = (z: number): number => {
  const negative = z < 0;
  const magnitude = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * magnitude);
  const polynomial =
    t *
    (0.31938153 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const upperTail = standardNormalPdf(magnitude) * polynomial;
  return negative ? upperTail : 1 - upperTail;
};

export const calculateStopLossNormalApproximation = (
  input: StopLossNormalApproximationInput,
): StopLossNormalApproximationOutput => {
  if (input.aggregateLossStdDev <= 0)
    simpleError(
      "aggregateLossStdDev",
      "The aggregate loss standard deviation must be positive.",
      "invalid_value",
    );
  const z =
    (input.attachmentPoint - input.expectedAggregateLoss) /
    input.aggregateLossStdDev;
  const premium =
    input.aggregateLossStdDev * standardNormalPdf(z) +
    (input.expectedAggregateLoss - input.attachmentPoint) *
      (1 - standardNormalCdf(z));
  return {
    expectedStopLossCost: roundStatistic(Math.max(0, premium)),
  };
};

export const stopLossNormalApproximationTool = createSimpleTool({
  calculate: (input) =>
    calculateStopLossNormalApproximation(
      input as unknown as StopLossNormalApproximationInput,
    ),
  description:
    "Estimate the expected aggregate loss above an attachment point under a normal approximation, before expenses or risk loads.",
  id: "actuarial/stop-loss-normal-approximation",
  inputs: [
    {
      description: "Attachment point of the stop-loss cover.",
      id: "attachmentPoint",
      kind: "number",
      label: "Attachment point",
      minimum: 0,
    },
    {
      description: "Expected aggregate loss amount for the period.",
      id: "expectedAggregateLoss",
      kind: "number",
      label: "Expected aggregate loss",
      minimum: 0,
    },
    {
      description: "Standard deviation of the aggregate loss amount.",
      id: "aggregateLossStdDev",
      kind: "number",
      label: "Aggregate loss standard deviation",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Pure stop-loss premium above the attachment point under normality.",
      id: "expectedStopLossCost",
      kind: "number",
      label: "Expected stop-loss cost",
    },
  ],
  title: "Stop-Loss Normal Approximation Expected Cost Calculator",
});
export const runStopLossNormalApproximation =
  stopLossNormalApproximationTool.execute;
export default stopLossNormalApproximationTool;
