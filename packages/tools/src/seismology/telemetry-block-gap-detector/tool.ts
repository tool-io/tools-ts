import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const telemetryBlockGapDetectorExample = {
  input: { blockSampleCounts: [100, 97, 100, 80], expectedPerBlock: 100 },
  output: { gapBlockIndices: [1, 3], missingTotal: 23 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const telemetryBlockGapDetectorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ blockSampleCounts, expectedPerBlock }) => {
      const xs = blockSampleCounts as unknown[];
      if (!Array.isArray(xs) || xs.length === 0)
        simpleError("blockSampleCounts", "Provide block counts.");
      const arr = xs as number[];
      const gapBlockIndices: number[] = [];
      let missingTotal = 0;
      arr.forEach((c, i) => {
        if (c < expectedPerBlock) {
          gapBlockIndices.push(i);
          missingTotal += expectedPerBlock - c;
        }
      });
      return { gapBlockIndices, missingTotal };
    })(input as never) as Record<string, unknown>,
  description:
    "Locate telemetry blocks whose sample counts fall below the expected quota.",
  id: "seismology/telemetry-block-gap-detector",
  inputs: [
    {
      description: "Samples received per block.",
      id: "blockSampleCounts",
      kind: "numberList",
      label: "n_i",
    },
    {
      minimum: 1,
      description: "Expected samples per block.",
      id: "expectedPerBlock",
      kind: "integer",
      label: "N_exp",
    },
  ],
  outputs: [
    {
      description: "Zero-based indices of short blocks.",
      id: "gapBlockIndices",
      kind: "numberList",
      label: "Gaps",
    },
    {
      description: "Total missing samples.",
      id: "missingTotal",
      kind: "integer",
      label: "Missing",
    },
  ],
  title: "Telemetry Block Gap Detector",
});
export const runTelemetryBlockGapDetector =
  telemetryBlockGapDetectorTool.execute;
export { telemetryBlockGapDetectorExample as example };
export default telemetryBlockGapDetectorTool;
