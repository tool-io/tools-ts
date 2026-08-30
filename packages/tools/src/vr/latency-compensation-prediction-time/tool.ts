import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LatencyCompensationPredictionTimeInput = Readonly<{
  readonly measuredLatencyMilliseconds: number;
  readonly reserveMilliseconds: number;
}>;
export type LatencyCompensationPredictionTimeOutput = Readonly<{
  readonly predictionMilliseconds: number;
}>;

export const calculateLatencyCompensationPredictionTime = (
  x: LatencyCompensationPredictionTimeInput,
): LatencyCompensationPredictionTimeOutput => {
  if (
    !Number.isFinite(x.measuredLatencyMilliseconds) ||
    x.measuredLatencyMilliseconds < 0
  )
    simpleError(
      "measuredLatencyMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.reserveMilliseconds) || x.reserveMilliseconds < 0)
    simpleError("reserveMilliseconds", "Provide a finite nonnegative number.");
  const predictionMilliseconds =
    x.measuredLatencyMilliseconds + x.reserveMilliseconds;
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
    measuredLatencyMilliseconds: 20,
    reserveMilliseconds: 2,
  },
  output: { predictionMilliseconds: 22 },
} satisfies ToolExample<
  LatencyCompensationPredictionTimeInput,
  LatencyCompensationPredictionTimeOutput
>;

export const tool = createSimpleTool({
  id: "vr/latency-compensation-prediction-time",
  title: "Latency Compensation Prediction Time",
  description:
    "Prediction horizon from measured motion-to-photon latency plus a user-supplied timing reserve.",
  inputs: [
    {
      id: "measuredLatencyMilliseconds",
      kind: "number",
      label: "Measured Latency Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "reserveMilliseconds",
      kind: "number",
      label: "Reserve Milliseconds",
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
    calculateLatencyCompensationPredictionTime({
      measuredLatencyMilliseconds: input.measuredLatencyMilliseconds as number,
      reserveMilliseconds: input.reserveMilliseconds as number,
    }),
});
export const latencyCompensationPredictionTimeTool = tool;
export const runLatencyCompensationPredictionTime = tool.execute;
export default tool;
