import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { cycles: 80, frequencyHz: 1000000000 },
  output: { latencyNs: 80 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/memory-latency",
  title: "Memory Latency from Cycles",
  description:
    "Convert a latency measured in clock cycles to nanoseconds using a clock frequency in hertz. Ensure the cycle count and frequency refer to the same clock domain.",
  inputs: [
    { id: "cycles", kind: "number", label: "Latency (cycles)", minimum: 0 },
    {
      id: "frequencyHz",
      kind: "number",
      label: "Clock frequency (Hz)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "latencyNs", kind: "number", label: "Latency ns" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { latencyNs: (i.cycles / i.frequencyHz) * 1e9 };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type MemoryLatencyInput = Readonly<typeof example.input>;
export type MemoryLatencyOutput = Readonly<typeof example.output>;
export const memoryLatencyTool = tool;
export const runMemoryLatency = tool.execute;
export default tool;
