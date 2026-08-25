import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TcaIncidenceProbabilityInput = {
  readonly bottlesOpened: number;
  readonly perBottleTaintRate?: number;
};

export type TcaIncidenceProbabilityOutput = {
  readonly atLeastOneTaintedProbability: number;
};

export const tcaIncidenceProbabilityExample = {
  input: {
    bottlesOpened: 12,
    perBottleTaintRate: 0.02,
  },
  output: {
    atLeastOneTaintedProbability: 0.215283276265,
  },
} satisfies ToolExample<
  TcaIncidenceProbabilityInput,
  TcaIncidenceProbabilityOutput
>;

export const calculateTcaIncidence = (
  input: TcaIncidenceProbabilityInput,
): TcaIncidenceProbabilityOutput => {
  if (input.bottlesOpened < 0)
    simpleError(
      "bottlesOpened",
      "The bottle count cannot be negative.",
      "invalid_value",
    );
  const taintRate = input.perBottleTaintRate ?? 0.02;
  if (taintRate < 0 || taintRate > 1)
    simpleError(
      "perBottleTaintRate",
      "The per-bottle taint rate must be between zero and one.",
      "invalid_value",
    );
  return {
    atLeastOneTaintedProbability: roundStatistic(
      1 - (1 - taintRate) ** input.bottlesOpened,
    ),
  };
};

export const tcaIncidenceProbabilityTool = createSimpleTool({
  calculate: (input) =>
    calculateTcaIncidence(input as unknown as TcaIncidenceProbabilityInput),
  description:
    "Estimate the chance of hitting at least one corked bottle in a case given the industry taint rate.",
  id: "oenology/tca-incidence-probability",
  inputs: [
    {
      description: "Bottles to be opened.",
      id: "bottlesOpened",
      kind: "integer",
      label: "Bottles",
      maximum: 100000,
      minimum: 0,
    },
    {
      default: 0.02,
      description:
        "Per-bottle probability of cork taint; two percent is a commonly cited modern rate.",
      id: "perBottleTaintRate",
      kind: "number",
      label: "Taint rate",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Probability that at least one of the bottles is tainted.",
      id: "atLeastOneTaintedProbability",
      kind: "number",
      label: "At least one tainted",
    },
  ],
  title: "Cork Taint TCA Incidence Probability Calculator",
});
export const runTcaIncidenceProbability = tcaIncidenceProbabilityTool.execute;
export default tcaIncidenceProbabilityTool;
