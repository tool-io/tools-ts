import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UartFrameBitsInput = Readonly<{
  readonly startBits: number;
  readonly dataBits: number;
  readonly parityBits: number;
  readonly stopBits: number;
}>;
export type UartFrameBitsOutput = Readonly<{
  readonly frameBits: number;
}>;

export const calculateUartFrameBits = (
  x: UartFrameBitsInput,
): UartFrameBitsOutput => {
  if (
    !Number.isFinite(x.startBits) ||
    !Number.isSafeInteger(x.startBits) ||
    x.startBits < 0
  )
    simpleError("startBits", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.dataBits) ||
    !Number.isSafeInteger(x.dataBits) ||
    x.dataBits < 0
  )
    simpleError("dataBits", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.parityBits) ||
    !Number.isSafeInteger(x.parityBits) ||
    x.parityBits < 0
  )
    simpleError("parityBits", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.stopBits) ||
    !Number.isSafeInteger(x.stopBits) ||
    x.stopBits < 0
  )
    simpleError("stopBits", "Provide a safe integer at least 0.");
  if (
    ![0, 1].includes(x.parityBits) ||
    x.startBits !== 1 ||
    !Number.isSafeInteger(x.dataBits) ||
    x.dataBits < 5 ||
    x.dataBits > 9 ||
    ![1, 2].includes(x.stopBits)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const frameBits = x.startBits + x.dataBits + x.parityBits + x.stopBits;
  if (!Number.isFinite(frameBits) || !Number.isSafeInteger(frameBits))
    simpleError(
      "frameBits",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frameBits: Object.is(frameBits, -0) ? 0 : frameBits };
};

export const example = {
  input: { startBits: 1, dataBits: 8, parityBits: 1, stopBits: 1 },
  output: { frameBits: 11 },
} satisfies ToolExample<UartFrameBitsInput, UartFrameBitsOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/uart-frame-bits",
  title: "UART Frame Bits",
  description:
    "Bits on the wire per UART character from start, data, optional parity and stop bit counts; excludes idle time.",
  inputs: [
    { id: "startBits", kind: "integer", label: "Start Bits", minimum: 0 },
    { id: "dataBits", kind: "integer", label: "Data Bits", minimum: 0 },
    { id: "parityBits", kind: "integer", label: "Parity Bits", minimum: 0 },
    { id: "stopBits", kind: "integer", label: "Stop Bits", minimum: 0 },
  ],
  outputs: [{ id: "frameBits", kind: "integer", label: "Frame Bits" }],
  calculate: (input) =>
    calculateUartFrameBits({
      startBits: input.startBits as number,
      dataBits: input.dataBits as number,
      parityBits: input.parityBits as number,
      stopBits: input.stopBits as number,
    }),
});
export const uartFrameBitsTool = tool;
export const runUartFrameBits = tool.execute;
export default tool;
