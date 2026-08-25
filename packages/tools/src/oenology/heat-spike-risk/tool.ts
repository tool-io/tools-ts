import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type HeatSpikeRiskInput = {
  readonly criticalTemperatureC: number;
  readonly exposureHours: number;
  readonly mustTemperatureC: number;
};

export type HeatSpikeRiskOutput = {
  readonly heatStressIndex: number;
  readonly temperatureExcessC: number;
};

export const heatSpikeRiskExample = {
  input: {
    criticalTemperatureC: 30,
    exposureHours: 4,
    mustTemperatureC: 35,
  },
  output: {
    heatStressIndex: 20,
    temperatureExcessC: 5,
  },
} satisfies ToolExample<HeatSpikeRiskInput, HeatSpikeRiskOutput>;

export const calculateHeatSpikeRisk = (
  input: HeatSpikeRiskInput,
): HeatSpikeRiskOutput => {
  const critical = input.criticalTemperatureC;
  const excess = Math.max(0, input.mustTemperatureC - critical);
  return {
    heatStressIndex: roundStatistic(excess * input.exposureHours),
    temperatureExcessC: roundStatistic(excess),
  };
};

export const heatSpikeRiskTool = createSimpleTool({
  calculate: (input) =>
    calculateHeatSpikeRisk(input as unknown as HeatSpikeRiskInput),
  description:
    "Calculate temperature-exposure degree-hours above a caller-selected critical temperature; the index quantifies exposure but does not independently predict yeast injury.",
  id: "oenology/heat-spike-risk",
  inputs: [
    {
      description:
        "Critical temperature selected for the yeast and must conditions.",
      id: "criticalTemperatureC",
      kind: "number",
      label: "Critical temperature",
      unit: "°C",
    },
    {
      description: "Hours the must spends at the elevated temperature.",
      id: "exposureHours",
      kind: "number",
      label: "Exposure",
      minimum: 0,
      unit: "h",
    },
    {
      description: "Measured fermentation temperature.",
      id: "mustTemperatureC",
      kind: "number",
      label: "Must temperature",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "Degree-hours of heat stress above the critical point.",
      id: "heatStressIndex",
      kind: "number",
      label: "Heat stress index",
    },
    {
      description: "Degrees above the critical temperature.",
      id: "temperatureExcessC",
      kind: "number",
      label: "Temperature excess",
      unit: "°C",
    },
  ],
  title: "Fermentation Heat Exposure Degree-Hours Calculator",
});
export const runHeatSpikeRisk = heatSpikeRiskTool.execute;
export default heatSpikeRiskTool;
