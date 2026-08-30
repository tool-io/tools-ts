import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpiTransferTimeInput = Readonly<{
  readonly frameCount: number;
  readonly bitsPerFrame: number;
  readonly clockHertz: number;
}>;
export type SpiTransferTimeOutput = Readonly<{
  readonly transferSeconds: number;
}>;

export const calculateSpiTransferTime = (
  x: SpiTransferTimeInput,
): SpiTransferTimeOutput => {
  if (
    !Number.isFinite(x.frameCount) ||
    !Number.isSafeInteger(x.frameCount) ||
    x.frameCount < 0
  )
    simpleError("frameCount", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.bitsPerFrame) || x.bitsPerFrame < 0)
    simpleError("bitsPerFrame", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.clockHertz) || x.clockHertz < 0)
    simpleError("clockHertz", "Provide a finite number at least 0.");
  if (
    !Number.isSafeInteger(x.frameCount) ||
    !Number.isSafeInteger(x.bitsPerFrame) ||
    x.bitsPerFrame < 1
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const transferSeconds = (x.frameCount * x.bitsPerFrame) / x.clockHertz;
  if (!Number.isFinite(transferSeconds))
    simpleError(
      "transferSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    transferSeconds: Object.is(transferSeconds, -0) ? 0 : transferSeconds,
  };
};

export const example = {
  input: { frameCount: 100, bitsPerFrame: 8, clockHertz: 1000000 },
  output: { transferSeconds: 0.0008 },
} satisfies ToolExample<SpiTransferTimeInput, SpiTransferTimeOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/spi-transfer-time",
  title: "SPI Transfer Time",
  description:
    "Ideal SPI clocking time for fixed-length frames, excluding chip-select setup, inter-frame delays and software overhead.",
  inputs: [
    { id: "frameCount", kind: "integer", label: "Frame Count", minimum: 0 },
    { id: "bitsPerFrame", kind: "number", label: "Bits Per Frame", minimum: 0 },
    {
      id: "clockHertz",
      kind: "number",
      label: "Clock Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "transferSeconds",
      kind: "number",
      label: "Transfer Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateSpiTransferTime({
      frameCount: input.frameCount as number,
      bitsPerFrame: input.bitsPerFrame as number,
      clockHertz: input.clockHertz as number,
    }),
});
export const spiTransferTimeTool = tool;
export const runSpiTransferTime = tool.execute;
export default tool;
