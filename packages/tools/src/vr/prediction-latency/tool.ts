import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PredictionLatencyInput = Readonly<{
  readonly measurementMilliseconds: number;
  readonly targetDisplayMilliseconds: number;
}>;
export type PredictionLatencyOutput = Readonly<{
  readonly predictionMilliseconds: number;
}>;

export const calculatePredictionLatency = (
  x: PredictionLatencyInput,
): PredictionLatencyOutput => {
  if (
    !Number.isFinite(x.measurementMilliseconds) ||
    x.measurementMilliseconds < 0
  )
    simpleError(
      "measurementMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.targetDisplayMilliseconds) ||
    x.targetDisplayMilliseconds < 0
  )
    simpleError(
      "targetDisplayMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (!(x.targetDisplayMilliseconds >= x.measurementMilliseconds))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const predictionMilliseconds =
    x.targetDisplayMilliseconds - x.measurementMilliseconds;
  if (!Number.isFinite(predictionMilliseconds))
    simpleError(
      "predictionMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    predictionMilliseconds: Object.is(predictionMilliseconds, -0)
      ? 0
      : predictionMilliseconds,
  };
};

export const example = {
  input: {
    measurementMilliseconds: 1000,
    targetDisplayMilliseconds: 1015,
  },
  output: { predictionMilliseconds: 15 },
} satisfies ToolExample<PredictionLatencyInput, PredictionLatencyOutput>;

export const tool = createSimpleTool({
  id: "vr/prediction-latency",
  title: "Prediction Latency",
  description:
    "Prediction horizon in milliseconds from pose-measurement timestamp to target display timestamp on the same clock.",
  inputs: [
    {
      id: "measurementMilliseconds",
      kind: "number",
      label: "Measurement Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "targetDisplayMilliseconds",
      kind: "number",
      label: "Target Display Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "predictionMilliseconds",
      kind: "number",
      label: "Prediction Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculatePredictionLatency({
      measurementMilliseconds: input.measurementMilliseconds as number,
      targetDisplayMilliseconds: input.targetDisplayMilliseconds as number,
    }),
});
export const predictionLatencyTool = tool;
export const runPredictionLatency = tool.execute;
export default tool;
