import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { baudRate: 115200 },
  output: { bitTimeMicroseconds: 8.680555555555555 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/uart-bit-time",
  title: "UART Bit Time",
  description:
    "Calculate the nominal duration of one UART bit as 1/baud. Output is microseconds; framing, clock mismatch, and oversampling do not change the nominal bit period.",
  inputs: [
    {
      id: "baudRate",
      kind: "number",
      label: "Baud rate (bit/s)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "bitTimeMicroseconds",
      kind: "number",
      label: "Bit Time Microseconds",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { bitTimeMicroseconds: 1e6 / i.baudRate };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type UartBitTimeInput = Readonly<typeof example.input>;
export type UartBitTimeOutput = Readonly<typeof example.output>;
export const uartBitTimeTool = tool;
export const runUartBitTime = tool.execute;
export default tool;
