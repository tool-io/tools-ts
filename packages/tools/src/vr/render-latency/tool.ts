import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RenderLatencyInput = Readonly<{
  readonly cpuMilliseconds: number;
  readonly gpuMilliseconds: number;
}>;
export type RenderLatencyOutput = Readonly<{
  readonly renderMilliseconds: number;
}>;

export const calculateRenderLatency = (
  x: RenderLatencyInput,
): RenderLatencyOutput => {
  if (!Number.isFinite(x.cpuMilliseconds) || x.cpuMilliseconds < 0)
    simpleError("cpuMilliseconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.gpuMilliseconds) || x.gpuMilliseconds < 0)
    simpleError("gpuMilliseconds", "Provide a finite nonnegative number.");
  const renderMilliseconds = x.cpuMilliseconds + x.gpuMilliseconds;
  if (!Number.isFinite(renderMilliseconds))
    simpleError(
      "renderMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    renderMilliseconds: Object.is(renderMilliseconds, -0)
      ? 0
      : renderMilliseconds,
  };
};

export const example = {
  input: {
    cpuMilliseconds: 3,
    gpuMilliseconds: 6,
  },
  output: { renderMilliseconds: 9 },
} satisfies ToolExample<RenderLatencyInput, RenderLatencyOutput>;

export const tool = createSimpleTool({
  id: "vr/render-latency",
  title: "Render Latency",
  description:
    "Serial render latency from CPU preparation plus GPU rendering; does not model pipelined overlap.",
  inputs: [
    {
      id: "cpuMilliseconds",
      kind: "number",
      label: "Cpu Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "gpuMilliseconds",
      kind: "number",
      label: "Gpu Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "renderMilliseconds",
      kind: "number",
      label: "Render Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateRenderLatency({
      cpuMilliseconds: input.cpuMilliseconds as number,
      gpuMilliseconds: input.gpuMilliseconds as number,
    }),
});
export const renderLatencyTool = tool;
export const runRenderLatency = tool.execute;
export default tool;
