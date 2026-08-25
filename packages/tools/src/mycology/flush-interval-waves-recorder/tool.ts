import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const flushIntervalWavesRecorderExample = {
  input: { daysSinceLastFlushInt: 5 },
  output: { flushIntervalDays: 5 },
} satisfies ToolExample<
  {
    readonly daysSinceLastFlushInt: number;
  },
  {
    readonly flushIntervalDays: number;
  }
>;

export const flushIntervalWavesRecorderTool = createSimpleTool({
  id: "mycology/flush-interval-waves-recorder",
  title: "Flush Interval Recorder",
  description:
    "Validate and record the number of elapsed days between cultivation flushes without applying species-independent timing categories.",
  inputs: [
    {
      id: "daysSinceLastFlushInt",
      label: "Days since last flush",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "flushIntervalDays", label: "Flush interval days", kind: "integer" },
  ],
  calculate: (input) => {
    const flushIntervalDays = input.daysSinceLastFlushInt as number;
    return { flushIntervalDays };
  },
});
export const runFlushIntervalWavesRecorder =
  flushIntervalWavesRecorderTool.execute;
export default flushIntervalWavesRecorderTool;
