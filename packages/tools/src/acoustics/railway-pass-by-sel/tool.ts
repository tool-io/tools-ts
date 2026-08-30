import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RailwayPassBySelInput = Readonly<{
  readonly eventLeqDecibels: number;
  readonly eventSeconds: number;
}>;
export type RailwayPassBySelOutput = Readonly<{
  readonly selDecibels: number;
}>;

export const calculateRailwayPassBySel = (
  x: RailwayPassBySelInput,
): RailwayPassBySelOutput => {
  if (!Number.isFinite(x.eventLeqDecibels))
    simpleError("eventLeqDecibels", "Provide a finite number.");
  if (!Number.isFinite(x.eventSeconds) || x.eventSeconds <= 0)
    simpleError("eventSeconds", "Provide a finite positive number.");
  const selDecibels = x.eventLeqDecibels + 10 * Math.log10(x.eventSeconds);
  if (!Number.isFinite(selDecibels))
    simpleError(
      "selDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { selDecibels: Object.is(selDecibels, -0) ? 0 : selDecibels };
};

export const example = {
  input: {
    eventLeqDecibels: 80,
    eventSeconds: 10,
  },
  output: { selDecibels: 90 },
} satisfies ToolExample<RailwayPassBySelInput, RailwayPassBySelOutput>;

export const tool = createSimpleTool({
  id: "acoustics/railway-pass-by-sel",
  title: "Railway Pass By Sel",
  description:
    "Sound exposure level from a pass-by Leq and event duration relative to one second.",
  inputs: [
    {
      id: "eventLeqDecibels",
      kind: "number",
      label: "Event Leq Decibels",
      unit: "dB",
    },
    {
      id: "eventSeconds",
      kind: "number",
      label: "Event Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "selDecibels", kind: "number", label: "Sel Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateRailwayPassBySel({
      eventLeqDecibels: input.eventLeqDecibels as number,
      eventSeconds: input.eventSeconds as number,
    }),
});
export const railwayPassBySelTool = tool;
export const runRailwayPassBySel = tool.execute;
export default tool;
