import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type EthylAcetateThresholdInput = {
  readonly ethylAcetateMgPerL: number;
  readonly thresholdMgPerL: number;
};

export type EthylAcetateThresholdOutput = {
  readonly excessMgPerL: number;
  readonly withinThreshold: boolean;
};

export const ethylAcetateThresholdExample = {
  input: {
    ethylAcetateMgPerL: 120,
    thresholdMgPerL: 200,
  },
  output: {
    excessMgPerL: 0,
    withinThreshold: true,
  },
} satisfies ToolExample<
  EthylAcetateThresholdInput,
  EthylAcetateThresholdOutput
>;

export const calculateEthylAcetateThreshold = (
  input: EthylAcetateThresholdInput,
): EthylAcetateThresholdOutput => {
  const threshold = input.thresholdMgPerL;
  if (threshold <= 0)
    simpleError(
      "thresholdMgPerL",
      "The comparison threshold must be positive.",
      "invalid_value",
    );
  const excess = Math.max(
    0,
    roundStatistic(input.ethylAcetateMgPerL - threshold),
  );
  return {
    excessMgPerL: excess,
    withinThreshold: excess === 0,
  };
};

export const ethylAcetateThresholdTool = createSimpleTool({
  calculate: (input) =>
    calculateEthylAcetateThreshold(
      input as unknown as EthylAcetateThresholdInput,
    ),
  description:
    "Compare measured ethyl acetate with a caller-supplied sensory or process threshold; perceived character and threshold vary with concentration, wine matrix, and assessor.",
  id: "oenology/ethyl-acetate-threshold",
  inputs: [
    {
      description: "Ethyl acetate measured in the wine.",
      id: "ethylAcetateMgPerL",
      kind: "number",
      label: "Ethyl acetate",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description: "Sensory or process threshold selected for this wine.",
      id: "thresholdMgPerL",
      kind: "number",
      label: "Threshold",
      minimum: 0.000001,
      unit: "mg/L",
    },
  ],
  outputs: [
    {
      description: "Amount above the threshold, if any.",
      id: "excessMgPerL",
      kind: "number",
      label: "Excess",
      unit: "mg/L",
    },
    {
      description: "Whether the wine sits at or below the threshold.",
      id: "withinThreshold",
      kind: "boolean",
      label: "Within threshold",
    },
  ],
  title: "Ethyl Acetate Aroma Threshold Checker",
});
export const runEthylAcetateThreshold = ethylAcetateThresholdTool.execute;
export default ethylAcetateThresholdTool;
