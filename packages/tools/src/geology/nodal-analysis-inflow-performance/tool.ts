import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NodalAnalysisInflowPerformanceInput = {
  readonly reservoirPressureMegapascals: number;
  readonly flowingBottomholePressureMegapascals: number;
  readonly productivityIndexCubicMetresPerDayPerMegapascal?: number;
};

export type NodalAnalysisInflowPerformanceOutput = {
  readonly maximumFlowRateCubicMetresPerDay: number;
  readonly inflowFlowRateCubicMetresPerDay: number;
  readonly drawdownMegapascals: number;
};

export const calculateNodalAnalysisInflowPerformance = (
  input: NodalAnalysisInflowPerformanceInput,
): NodalAnalysisInflowPerformanceOutput => {
  const index = input.productivityIndexCubicMetresPerDayPerMegapascal ?? 2;
  if (!(input.reservoirPressureMegapascals > 0))
    return simpleError(
      "reservoirPressureMegapascals",
      "Reservoir pressure must be greater than zero.",
      "invalid_pressure",
    );
  if (!(index > 0))
    return simpleError(
      "productivityIndexCubicMetresPerDayPerMegapascal",
      "Productivity index must be greater than zero.",
      "invalid_index",
    );
  const pressureRatio =
    input.flowingBottomholePressureMegapascals /
    input.reservoirPressureMegapascals;
  if (!(pressureRatio >= 0 && pressureRatio <= 1))
    return simpleError(
      "flowingBottomholePressureMegapascals",
      "Flowing bottom-hole pressure must lie between zero and the reservoir pressure.",
      "invalid_pressure",
    );
  const maximumRate = (index * input.reservoirPressureMegapascals) / 1.8;
  return {
    maximumFlowRateCubicMetresPerDay: maximumRate,
    inflowFlowRateCubicMetresPerDay:
      maximumRate * (1 - 0.2 * pressureRatio - 0.8 * pressureRatio ** 2),
    drawdownMegapascals:
      input.reservoirPressureMegapascals -
      input.flowingBottomholePressureMegapascals,
  };
};

export const nodalAnalysisInflowPerformanceExample = {
  input: {
    reservoirPressureMegapascals: 24,
    flowingBottomholePressureMegapascals: 12,
    productivityIndexCubicMetresPerDayPerMegapascal: 2,
  },
  output: {
    maximumFlowRateCubicMetresPerDay: 26.666666666666664,
    inflowFlowRateCubicMetresPerDay: 18.666666666666664,
    drawdownMegapascals: 12,
  },
} satisfies ToolExample<
  NodalAnalysisInflowPerformanceInput,
  NodalAnalysisInflowPerformanceOutput
>;

export const nodalAnalysisInflowPerformanceTool = createSimpleTool({
  id: "geology/nodal-analysis-inflow-performance",
  title: "Nodal Analysis Inflow Performance Calculator",
  description:
    "Compute Vogel (1968) inflow performance for a saturated oil well from reservoir pressure, flowing bottom-hole pressure and productivity index.",
  inputs: [
    {
      description: "Average reservoir pressure in megapascals.",
      id: "reservoirPressureMegapascals",
      kind: "number",
      label: "Reservoir pressure",
    },
    {
      description: "Flowing bottom-hole pressure in megapascals.",
      id: "flowingBottomholePressureMegapascals",
      kind: "number",
      label: "FBHP",
    },
    {
      default: 2,
      description: "Productivity index in cubic metres per day per megapascal.",
      id: "productivityIndexCubicMetresPerDayPerMegapascal",
      kind: "number",
      label: "PI",
    },
  ],
  outputs: [
    {
      description:
        "Vogel maximum flow rate at zero bottom-hole pressure in cubic metres per day.",
      id: "maximumFlowRateCubicMetresPerDay",
      kind: "number",
      label: "AOF rate",
    },
    {
      description:
        "Vogel inflow rate at the given bottom-hole pressure in cubic metres per day.",
      id: "inflowFlowRateCubicMetresPerDay",
      kind: "number",
      label: "Inflow rate",
    },
    {
      description: "Drawdown in megapascals.",
      id: "drawdownMegapascals",
      kind: "number",
      label: "Drawdown",
    },
  ],
  calculate: (input) =>
    calculateNodalAnalysisInflowPerformance(
      input as unknown as NodalAnalysisInflowPerformanceInput,
    ),
});

export const runNodalAnalysisInflowPerformance =
  nodalAnalysisInflowPerformanceTool.execute;
export default nodalAnalysisInflowPerformanceTool;
