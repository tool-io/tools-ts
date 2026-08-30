import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlexrayCycleTimeInput = Readonly<{
  readonly staticSegmentUs: number;
  readonly dynamicSegmentUs: number;
  readonly symbolWindowUs: number;
  readonly networkIdleUs: number;
}>;
export type FlexrayCycleTimeOutput = Readonly<{
  readonly cycleTimeUs: number;
}>;

export const calculateFlexrayCycleTime = (
  x: FlexrayCycleTimeInput,
): FlexrayCycleTimeOutput => {
  if (!Number.isFinite(x.staticSegmentUs) || x.staticSegmentUs < 0)
    simpleError("staticSegmentUs", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.dynamicSegmentUs) || x.dynamicSegmentUs < 0)
    simpleError("dynamicSegmentUs", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.symbolWindowUs) || x.symbolWindowUs < 0)
    simpleError("symbolWindowUs", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.networkIdleUs) || x.networkIdleUs < 0)
    simpleError("networkIdleUs", "Provide a finite number at least 0.");
  const cycleTimeUs =
    x.staticSegmentUs + x.dynamicSegmentUs + x.symbolWindowUs + x.networkIdleUs;
  if (!Number.isFinite(cycleTimeUs))
    simpleError("cycleTimeUs", "The inputs produce an invalid result.");
  return { cycleTimeUs: Object.is(cycleTimeUs, -0) ? 0 : cycleTimeUs };
};

export const example = {
  input: {
    staticSegmentUs: 1000,
    dynamicSegmentUs: 200,
    symbolWindowUs: 50,
    networkIdleUs: 50,
  },
  output: { cycleTimeUs: 1300 },
} satisfies ToolExample<FlexrayCycleTimeInput, FlexrayCycleTimeOutput>;

export const tool = createSimpleTool({
  id: "electronics/flexray-cycle-time",
  title: "FlexRay Cycle Time",
  description:
    "Sum configured FlexRay static, dynamic, symbol-window, and network-idle segment durations into one communication cycle.",
  inputs: [
    {
      id: "staticSegmentUs",
      kind: "number",
      label: "Static segment",
      unit: "µs",
      minimum: 0,
    },
    {
      id: "dynamicSegmentUs",
      kind: "number",
      label: "Dynamic segment",
      unit: "µs",
      minimum: 0,
    },
    {
      id: "symbolWindowUs",
      kind: "number",
      label: "Symbol window",
      unit: "µs",
      minimum: 0,
    },
    {
      id: "networkIdleUs",
      kind: "number",
      label: "Network idle time",
      unit: "µs",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "cycleTimeUs",
      kind: "number",
      label: "Communication cycle",
      unit: "µs",
    },
  ],
  calculate: (input) =>
    calculateFlexrayCycleTime({
      staticSegmentUs: input.staticSegmentUs as number,
      dynamicSegmentUs: input.dynamicSegmentUs as number,
      symbolWindowUs: input.symbolWindowUs as number,
      networkIdleUs: input.networkIdleUs as number,
    }),
});
export const flexrayCycleTimeTool = tool;
export const runFlexrayCycleTime = tool.execute;
export default tool;
