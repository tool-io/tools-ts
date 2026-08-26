import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DualSystemChandrasekarDemingEstimatorInput = {
  readonly inBothLists: number;
  readonly inFirstListOnly: number;
  readonly inSecondListOnly: number;
};

export type DualSystemChandrasekarDemingEstimatorOutput = {
  readonly estimatedTotal: number;
  readonly missedByBothLists: number;
};

export const calculateDualSystemChandrasekarDemingEstimator = (
  input: DualSystemChandrasekarDemingEstimatorInput,
): DualSystemChandrasekarDemingEstimatorOutput => {
  for (const key of [
    "inBothLists",
    "inFirstListOnly",
    "inSecondListOnly",
  ] as const) {
    if (!Number.isSafeInteger(input[key]) || input[key] < 0)
      return simpleError(
        key,
        "Dual-system cell counts must be non-negative integers.",
        "invalid_count",
      );
  }
  if (input.inBothLists < 1)
    return simpleError(
      "inBothLists",
      "At least one record must appear on both lists.",
      "invalid_count",
    );
  const a = input.inBothLists;
  const estimatedTotal =
    ((a + input.inFirstListOnly + 1) * (a + input.inSecondListOnly + 1)) /
      (a + 1) -
    1;
  return {
    estimatedTotal,
    missedByBothLists:
      estimatedTotal - a - input.inFirstListOnly - input.inSecondListOnly,
  };
};

export const dualSystemChandrasekarDemingEstimatorExample = {
  input: { inBothLists: 600, inFirstListOnly: 250, inSecondListOnly: 350 },
  output: {
    estimatedTotal: 1345.5906821963395,
    missedByBothLists: 145.59068219633946,
  },
} satisfies ToolExample<
  DualSystemChandrasekarDemingEstimatorInput,
  DualSystemChandrasekarDemingEstimatorOutput
>;

export const dualSystemChandrasekarDemingEstimatorTool = createSimpleTool({
  id: "demography/dual-system-chandrasekar-deming-estimator",
  title: "Dual System Chandrasekar Deming Estimator",
  description:
    "Estimate total population size and undercount from two incomplete enumeration lists using the Chandra Sekar-Deming dual-record estimator N-hat = (a+b+1)(a+c+1)/(a+1) - 1 with the one-per-cell continuity correction.",
  inputs: [
    {
      description: "Records appearing on both lists.",
      id: "inBothLists",
      kind: "number",
      label: "Both lists",
      minimum: 0,
    },
    {
      description: "Records appearing only on the first list.",
      id: "inFirstListOnly",
      kind: "number",
      label: "List 1 only",
      minimum: 0,
    },
    {
      description: "Records appearing only on the second list.",
      id: "inSecondListOnly",
      kind: "number",
      label: "List 2 only",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Estimated true total including persons missed by both lists.",
      id: "estimatedTotal",
      kind: "number",
      label: "Estimated total",
    },
    {
      description: "Estimated number missed by both lists.",
      id: "missedByBothLists",
      kind: "number",
      label: "Missed by both",
    },
  ],
  calculate: (input) =>
    calculateDualSystemChandrasekarDemingEstimator(
      input as unknown as DualSystemChandrasekarDemingEstimatorInput,
    ),
});

export const runDualSystemChandrasekarDemingEstimator =
  dualSystemChandrasekarDemingEstimatorTool.execute;
export default dualSystemChandrasekarDemingEstimatorTool;
