import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type VesicleCountSegmentTallyCalculatorInput = {
  readonly segmentsViewedInt: number;
  readonly totalVesiclesInt: number;
};

export type VesicleCountSegmentTallyCalculatorOutput = {
  readonly meanVesiclesPerSegment: number;
};

export const vesicleCountSegmentTallyCalculatorExample = {
  input: { segmentsViewedInt: 7, totalVesiclesInt: 42 },
  output: { meanVesiclesPerSegment: 6 },
} satisfies ToolExample<
  VesicleCountSegmentTallyCalculatorInput,
  VesicleCountSegmentTallyCalculatorOutput
>;

export const vesicleCountSegmentTallyCalculatorTool = createSimpleTool({
  id: "mycology/vesicle-count-segment-tally-calculator",
  title: "Vesicle Tally",
  description:
    "Calculate the arithmetic mean number of observed vesicles per viewed root segment from a total count and segment count.",
  inputs: [
    {
      id: "totalVesiclesInt",
      kind: "integer",
      label: "Total vesicles",
      minimum: 0,
    },
    {
      id: "segmentsViewedInt",
      kind: "integer",
      label: "Segments viewed",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "meanVesiclesPerSegment",
      kind: "number",
      label: "Mean vesicles per segment",
      minimum: 0,
    },
  ],
  calculate: (input) => ({
    meanVesiclesPerSegment:
      (input.totalVesiclesInt as number) / (input.segmentsViewedInt as number),
  }),
});
export const runVesicleCountSegmentTallyCalculator =
  vesicleCountSegmentTallyCalculatorTool.execute;
export default vesicleCountSegmentTallyCalculatorTool;
