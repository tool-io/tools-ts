import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type AngelsShareLossInput = {
  readonly agingMonths?: number;
  readonly annualEvaporationRatePercent?: number;
  readonly volumeLiters: number;
};

export type AngelsShareLossOutput = {
  readonly lossLiters: number;
};

export const angelsShareLossExample = {
  input: {
    agingMonths: 12,
    annualEvaporationRatePercent: 2,
    volumeLiters: 225,
  },
  output: {
    lossLiters: 4.5,
  },
} satisfies ToolExample<AngelsShareLossInput, AngelsShareLossOutput>;

export const calculateAngelsShareLoss = (
  input: AngelsShareLossInput,
): AngelsShareLossOutput => {
  const rate = input.annualEvaporationRatePercent ?? 2;
  const months = input.agingMonths ?? 12;
  if (rate < 0 || rate > 100)
    simpleError(
      "annualEvaporationRatePercent",
      "The annual evaporation rate must be between zero and one hundred percent.",
      "invalid_value",
    );
  return {
    lossLiters: roundStatistic(
      input.volumeLiters * (1 - Math.pow(1 - rate / 100, months / 12)),
    ),
  };
};

export const angelsShareLossTool = createSimpleTool({
  calculate: (input) =>
    calculateAngelsShareLoss(input as unknown as AngelsShareLossInput),
  description:
    "Project cumulative barrel-aging evaporation from an annual percentage loss, compounding the loss against the remaining wine for fractional or multiple years.",
  id: "oenology/angels-share-loss",
  inputs: [
    {
      default: 12,
      description: "Months the lot spends in barrel.",
      id: "agingMonths",
      kind: "number",
      label: "Aging months",
      minimum: 0,
    },
    {
      default: 2,
      description:
        "Annual evaporation for the cellar; two percent is a temperate baseline, warmer drier cellars run higher.",
      id: "annualEvaporationRatePercent",
      kind: "number",
      label: "Annual evaporation",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Wine volume at the start of the period.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Volume expected to evaporate over the period.",
      id: "lossLiters",
      kind: "number",
      label: "Angel's share",
      unit: "L",
    },
  ],
  title: "Barrel Angel's Share Loss Calculator",
});
export const runAngelsShareLoss = angelsShareLossTool.execute;
export default angelsShareLossTool;
