import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotionToPhotonLatencyInput = Readonly<{
  readonly sensorMilliseconds: number;
  readonly poseMilliseconds: number;
  readonly renderMilliseconds: number;
  readonly compositorMilliseconds: number;
  readonly scanoutMilliseconds: number;
  readonly pixelResponseMilliseconds: number;
}>;
export type MotionToPhotonLatencyOutput = Readonly<{
  readonly latencyMilliseconds: number;
}>;

export const calculateMotionToPhotonLatency = (
  x: MotionToPhotonLatencyInput,
): MotionToPhotonLatencyOutput => {
  if (!Number.isFinite(x.sensorMilliseconds) || x.sensorMilliseconds < 0)
    simpleError("sensorMilliseconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.poseMilliseconds) || x.poseMilliseconds < 0)
    simpleError("poseMilliseconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.renderMilliseconds) || x.renderMilliseconds < 0)
    simpleError("renderMilliseconds", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.compositorMilliseconds) ||
    x.compositorMilliseconds < 0
  )
    simpleError(
      "compositorMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.scanoutMilliseconds) || x.scanoutMilliseconds < 0)
    simpleError("scanoutMilliseconds", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.pixelResponseMilliseconds) ||
    x.pixelResponseMilliseconds < 0
  )
    simpleError(
      "pixelResponseMilliseconds",
      "Provide a finite nonnegative number.",
    );
  const latencyMilliseconds =
    x.sensorMilliseconds +
    x.poseMilliseconds +
    x.renderMilliseconds +
    x.compositorMilliseconds +
    x.scanoutMilliseconds +
    x.pixelResponseMilliseconds;
  if (!Number.isFinite(latencyMilliseconds))
    simpleError(
      "latencyMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    latencyMilliseconds: Object.is(latencyMilliseconds, -0)
      ? 0
      : latencyMilliseconds,
  };
};

export const example = {
  input: {
    sensorMilliseconds: 2,
    poseMilliseconds: 3,
    renderMilliseconds: 8,
    compositorMilliseconds: 1,
    scanoutMilliseconds: 5,
    pixelResponseMilliseconds: 2,
  },
  output: { latencyMilliseconds: 21 },
} satisfies ToolExample<
  MotionToPhotonLatencyInput,
  MotionToPhotonLatencyOutput
>;

export const tool = createSimpleTool({
  id: "vr/motion-to-photon-latency",
  title: "Motion To Photon Latency",
  description:
    "Serial motion-to-photon estimate from sensing, pose processing, rendering, compositing, scanout and pixel response.",
  inputs: [
    {
      id: "sensorMilliseconds",
      kind: "number",
      label: "Sensor Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "poseMilliseconds",
      kind: "number",
      label: "Pose Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "renderMilliseconds",
      kind: "number",
      label: "Render Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "compositorMilliseconds",
      kind: "number",
      label: "Compositor Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "scanoutMilliseconds",
      kind: "number",
      label: "Scanout Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "pixelResponseMilliseconds",
      kind: "number",
      label: "Pixel Response Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "latencyMilliseconds",
      kind: "number",
      label: "Latency Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateMotionToPhotonLatency({
      sensorMilliseconds: input.sensorMilliseconds as number,
      poseMilliseconds: input.poseMilliseconds as number,
      renderMilliseconds: input.renderMilliseconds as number,
      compositorMilliseconds: input.compositorMilliseconds as number,
      scanoutMilliseconds: input.scanoutMilliseconds as number,
      pixelResponseMilliseconds: input.pixelResponseMilliseconds as number,
    }),
});
export const motionToPhotonLatencyTool = tool;
export const runMotionToPhotonLatency = tool.execute;
export default tool;
