import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChainLadderDevelopmentFactorInput = {
  readonly currentCumulativeLosses: readonly number[];
  readonly priorCumulativeLosses: readonly number[];
};

export type ChainLadderDevelopmentFactorOutput = {
  readonly developmentFactor: number;
};

export const chainLadderDevelopmentFactorExample = {
  input: {
    currentCumulativeLosses: [150, 280],
    priorCumulativeLosses: [100, 200],
  },
  output: {
    developmentFactor: 1.4333333333333333,
  },
} satisfies ToolExample<
  ChainLadderDevelopmentFactorInput,
  ChainLadderDevelopmentFactorOutput
>;

export const calculateChainLadderDevelopmentFactor = (
  input: ChainLadderDevelopmentFactorInput,
): ChainLadderDevelopmentFactorOutput => {
  if (
    input.currentCumulativeLosses.length !== input.priorCumulativeLosses.length
  )
    simpleError(
      "currentCumulativeLosses",
      "Both loss lists must describe the same set of exposure units.",
      "length_mismatch",
    );
  for (const [field, values] of [
    ["priorCumulativeLosses", input.priorCumulativeLosses],
    ["currentCumulativeLosses", input.currentCumulativeLosses],
  ] as const)
    if (values.some((value) => !Number.isFinite(value) || value < 0))
      simpleError(
        field,
        "Cumulative losses must be finite and nonnegative.",
        "invalid_losses",
      );
  const priorTotal = input.priorCumulativeLosses.reduce(
    (sum, value) => sum + value,
    0,
  );
  if (priorTotal <= 0)
    simpleError(
      "priorCumulativeLosses",
      "The prior cumulative losses must total a positive amount.",
      "invalid_value",
    );
  const currentTotal = input.currentCumulativeLosses.reduce(
    (sum, value) => sum + value,
    0,
  );
  if (!Number.isFinite(priorTotal) || !Number.isFinite(currentTotal))
    simpleError(
      "currentCumulativeLosses",
      "The cumulative loss totals are outside the finite numeric range.",
      "result_not_finite",
    );
  return {
    developmentFactor: currentTotal / priorTotal,
  };
};

export const chainLadderDevelopmentFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateChainLadderDevelopmentFactor({
      currentCumulativeLosses:
        input.currentCumulativeLosses as readonly number[],
      priorCumulativeLosses: input.priorCumulativeLosses as readonly number[],
    }),
  description:
    "Calculate the volume-weighted chain ladder age-to-age development factor from paired cumulative losses.",
  id: "actuarial/chain-ladder-development-factor",
  inputs: [
    {
      description:
        "Cumulative losses at the later valuation, aligned with the prior list.",
      id: "currentCumulativeLosses",
      kind: "numberList",
      label: "Current cumulative losses",
    },
    {
      description:
        "Cumulative losses at the earlier valuation for the same exposure units.",
      id: "priorCumulativeLosses",
      kind: "numberList",
      label: "Prior cumulative losses",
    },
  ],
  outputs: [
    {
      description:
        "Volume-weighted factor applied to prior cumulative losses to project the current total.",
      id: "developmentFactor",
      kind: "number",
      label: "Development factor",
    },
  ],
  title: "Chain Ladder Development Factor Calculator",
});
export const runChainLadderDevelopmentFactor =
  chainLadderDevelopmentFactorTool.execute;
export default chainLadderDevelopmentFactorTool;
