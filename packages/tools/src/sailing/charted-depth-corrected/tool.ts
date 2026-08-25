import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ChartedDepthCorrectedInput = {
  readonly chartedDepthMeters: number;
  readonly heightOfTideMeters: number;
};

export type ChartedDepthCorrectedOutput = {
  readonly depthInMeters: number;
};

export const chartedDepthCorrectedExample = {
  input: { chartedDepthMeters: 7, heightOfTideMeters: 2.5 },
  output: { depthInMeters: 9.5 },
} satisfies ToolExample<
  ChartedDepthCorrectedInput,
  ChartedDepthCorrectedOutput
>;

export const calculateChartedDepthCorrected = (
  input: ChartedDepthCorrectedInput,
): ChartedDepthCorrectedOutput => ({
  depthInMeters: input.chartedDepthMeters + input.heightOfTideMeters,
});

export const chartedDepthCorrectedTool = createSimpleTool({
  id: "sailing/charted-depth-corrected",
  title: "Corrected Depth Calculator",
  description:
    "Add the height of tide to the charted depth sounding to obtain the actual depth of water.",
  inputs: [
    {
      description: "Depth printed on the chart.",
      id: "chartedDepthMeters",
      kind: "number",
      label: "Charted depth",
      minimum: 0,
      unit: "m",
    },
    {
      description: "Signed height of tide above chart datum.",
      id: "heightOfTideMeters",
      kind: "number",
      label: "Height of tide",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Actual depth of water at the sounding.",
      format: "length-m",
      id: "depthInMeters",
      kind: "number",
      label: "Corrected depth",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateChartedDepthCorrected(
      input as unknown as ChartedDepthCorrectedInput,
    ),
});

export const runChartedDepthCorrected = chartedDepthCorrectedTool.execute;
export default chartedDepthCorrectedTool;
