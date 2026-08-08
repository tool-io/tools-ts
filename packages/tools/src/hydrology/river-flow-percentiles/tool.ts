import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type FlowPercentiles = {
  readonly maximum?: number;
  readonly minimum?: number;
  readonly p10: number;
  readonly p50: number;
  readonly p90: number;
};
export type RiverFlowContext = {
  readonly current: number;
  readonly ensemble: FlowPercentiles & {
    readonly maximum: number;
    readonly minimum: number;
  };
  readonly historical: FlowPercentiles & { readonly currentPercentile: number };
};
const quantile = (values: readonly number[], probability: number) => {
  const sorted = [...values].sort((a, b) => a - b),
    position = (sorted.length - 1) * probability,
    lower = Math.floor(position),
    fraction = position - lower;
  return (
    sorted[lower]! +
    (sorted[Math.min(lower + 1, sorted.length - 1)]! - sorted[lower]!) *
      fraction
  );
};
export const analyzeRiverFlowPercentiles = (
  current: number,
  historical: readonly number[],
  ensemble: readonly number[],
): RiverFlowContext | null => {
  if (
    current < 0 ||
    !historical.length ||
    !ensemble.length ||
    [...historical, ...ensemble].some((value) => value < 0)
  )
    return null;
  return {
    current,
    ensemble: {
      maximum: Math.max(...ensemble),
      minimum: Math.min(...ensemble),
      p10: quantile(ensemble, 0.1),
      p50: quantile(ensemble, 0.5),
      p90: quantile(ensemble, 0.9),
    },
    historical: {
      currentPercentile: Number(
        (
          (historical.filter((value) => value <= current).length /
            historical.length) *
          100
        ).toPrecision(8),
      ),
      p10: quantile(historical, 0.1),
      p50: quantile(historical, 0.5),
      p90: quantile(historical, 0.9),
    },
  };
};
export const riverFlowPercentilesExample = {
  input: {
    current: 150,
    ensemble: [130, 145, 155, 170, 190],
    historical: [80, 100, 120, 140, 160, 180, 200],
  },
  output: {
    context: {
      current: 150,
      ensemble: { maximum: 190, minimum: 130, p10: 136, p50: 155, p90: 182 },
      historical: { currentPercentile: 57.142857, p10: 92, p50: 140, p90: 188 },
    },
  },
} satisfies ToolExample<
  {
    readonly current: number;
    readonly ensemble: readonly number[];
    readonly historical: readonly number[];
  },
  { readonly context: RiverFlowContext }
>;
export const riverFlowPercentilesTool = createSimpleTool({
  id: "hydrology/river-flow-percentiles",
  title: "River Flow Percentile and Ensemble Range",
  description:
    "Compare current river flow with historical percentiles and a forecast ensemble range.",
  inputs: [
    { id: "current", kind: "number", label: "Current flow", minimum: 0 },
    {
      format: "dataset/river-flow-history",
      id: "historical",
      kind: "numberList",
      label: "Historical flows",
    },
    {
      format: "dataset/river-flow-ensemble",
      id: "ensemble",
      kind: "numberList",
      label: "Ensemble members",
    },
  ],
  outputs: [
    {
      format: "hydrology/flow-percentiles",
      id: "context",
      kind: "object",
      label: "Flow context",
    },
  ],
  calculate: (input) => {
    const context = analyzeRiverFlowPercentiles(
      input.current as number,
      input.historical as number[],
      input.ensemble as number[],
    );
    if (!context)
      return simpleError(
        "historical",
        "Enter nonempty nonnegative historical and ensemble values.",
      );
    return { context };
  },
});
export const runRiverFlowPercentiles = riverFlowPercentilesTool.execute;
export default riverFlowPercentilesTool;
