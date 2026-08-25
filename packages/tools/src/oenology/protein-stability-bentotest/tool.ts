import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ProteinStabilityBentotestInput = {
  readonly ntuIncrease: number;
  readonly thresholdNtu?: number;
};

export type ProteinStabilityBentotestOutput = {
  readonly excessNtu: number;
  readonly stable: boolean;
};

export const proteinStabilityBentotestExample = {
  input: {
    ntuIncrease: 1.5,
    thresholdNtu: 2,
  },
  output: {
    excessNtu: 0,
    stable: true,
  },
} satisfies ToolExample<
  ProteinStabilityBentotestInput,
  ProteinStabilityBentotestOutput
>;

export const calculateProteinStabilityBentotest = (
  input: ProteinStabilityBentotestInput,
): ProteinStabilityBentotestOutput => {
  const threshold = input.thresholdNtu ?? 2;
  if (threshold < 0)
    simpleError(
      "thresholdNtu",
      "The stability threshold cannot be negative.",
      "invalid_value",
    );
  const excess = Math.max(0, input.ntuIncrease - threshold);
  return {
    excessNtu: roundStatistic(excess),
    stable: excess === 0,
  };
};

export const proteinStabilityBentotestTool = createSimpleTool({
  calculate: (input) =>
    calculateProteinStabilityBentotest(
      input as unknown as ProteinStabilityBentotestInput,
    ),
  description:
    "Judge a Bentotest heat trial by comparing the turbidity increase against the stability threshold.",
  id: "oenology/protein-stability-bentotest",
  inputs: [
    {
      description: "NTU rise measured across the heat test.",
      id: "ntuIncrease",
      kind: "number",
      label: "NTU increase",
      minimum: 0,
    },
    {
      default: 2,
      description: "NTU rise tolerated before the wine counts as unstable.",
      id: "thresholdNtu",
      kind: "number",
      label: "Threshold",
      minimum: 0,
      unit: "NTU",
    },
  ],
  outputs: [
    {
      description: "Amount by which the trial exceeds the threshold, if any.",
      id: "excessNtu",
      kind: "number",
      label: "Excess",
      unit: "NTU",
    },
    {
      description: "Whether the wine passed the protein stability trial.",
      id: "stable",
      kind: "boolean",
      label: "Stable",
    },
  ],
  title: "Protein Stability Bentotest Checker",
});
export const runProteinStabilityBentotest =
  proteinStabilityBentotestTool.execute;
export default proteinStabilityBentotestTool;
