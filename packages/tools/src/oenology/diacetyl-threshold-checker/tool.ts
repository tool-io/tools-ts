import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type DiacetylThresholdCheckerInput = {
  readonly diacetylMgPerL: number;
  readonly thresholdMgPerL: number;
};

export type DiacetylThresholdCheckerOutput = {
  readonly butterNote: boolean;
  readonly excessMgPerL: number;
};

export const diacetylThresholdCheckerExample = {
  input: {
    diacetylMgPerL: 0.3,
    thresholdMgPerL: 1,
  },
  output: {
    butterNote: false,
    excessMgPerL: 0,
  },
} satisfies ToolExample<
  DiacetylThresholdCheckerInput,
  DiacetylThresholdCheckerOutput
>;

export const calculateDiacetylThreshold = (
  input: DiacetylThresholdCheckerInput,
): DiacetylThresholdCheckerOutput => {
  const threshold = input.thresholdMgPerL;
  const excess = Math.max(0, roundStatistic(input.diacetylMgPerL - threshold));
  if (threshold <= 0)
    simpleError(
      "thresholdMgPerL",
      "The sensory threshold must be positive.",
      "invalid_value",
    );
  return {
    butterNote: input.diacetylMgPerL > threshold,
    excessMgPerL: excess,
  };
};

export const diacetylThresholdCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateDiacetylThreshold(
      input as unknown as DiacetylThresholdCheckerInput,
    ),
  description:
    "Compare a measured diacetyl concentration with a caller-supplied sensory or process threshold and report the excess; perception depends on the wine matrix and assessor.",
  id: "oenology/diacetyl-threshold-checker",
  inputs: [
    {
      description: "Diacetyl measured in the wine.",
      id: "diacetylMgPerL",
      kind: "number",
      label: "Diacetyl",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description: "Sensory or process threshold selected for this wine.",
      id: "thresholdMgPerL",
      kind: "number",
      label: "Threshold",
      minimum: 0,
      unit: "mg/L",
    },
  ],
  outputs: [
    {
      description: "Whether the butter note is above the threshold.",
      id: "butterNote",
      kind: "boolean",
      label: "Butter note",
    },
    {
      description: "Amount above the threshold, if any.",
      id: "excessMgPerL",
      kind: "number",
      label: "Excess",
      unit: "mg/L",
    },
  ],
  title: "Diacetyl Threshold Butter Note Checker",
});
export const runDiacetylThresholdChecker = diacetylThresholdCheckerTool.execute;
export default diacetylThresholdCheckerTool;
