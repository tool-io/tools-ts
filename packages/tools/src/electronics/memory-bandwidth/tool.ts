import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { transfersPerSecond: 3200000000, bytesPerTransfer: 8, channels: 2 },
  output: { bandwidthBytesPerSecond: 51200000000, bandwidthGbPerSecond: 51.2 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/memory-bandwidth",
  title: "Memory Bandwidth",
  description:
    "Calculate theoretical aggregate bandwidth from transfers per second, bytes per transfer, and active channels. Output is decimal GB/s (10⁹ bytes/s); protocol overhead and idle cycles are excluded.",
  inputs: [
    {
      id: "transfersPerSecond",
      kind: "number",
      label: "Transfers per second",
      minimum: 0,
    },
    {
      id: "bytesPerTransfer",
      kind: "number",
      label: "Bytes per transfer",
      minimum: 0,
    },
    { id: "channels", kind: "integer", label: "Parallel channels", minimum: 1 },
  ],
  outputs: [
    {
      id: "bandwidthBytesPerSecond",
      kind: "number",
      label: "Bandwidth Bytes Per Second",
    },
    {
      id: "bandwidthGbPerSecond",
      kind: "number",
      label: "Bandwidth Gb Per Second",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      bandwidthBytesPerSecond:
        i.transfersPerSecond * i.bytesPerTransfer * i.channels,
      bandwidthGbPerSecond:
        (i.transfersPerSecond * i.bytesPerTransfer * i.channels) / 1e9,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type MemoryBandwidthInput = Readonly<typeof example.input>;
export type MemoryBandwidthOutput = Readonly<typeof example.output>;
export const memoryBandwidthTool = tool;
export const runMemoryBandwidth = tool.execute;
export default tool;
