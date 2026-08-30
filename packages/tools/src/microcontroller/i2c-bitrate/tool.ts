import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type I2cBitrateInput = Readonly<{
  readonly highSeconds: number;
  readonly lowSeconds: number;
}>;
export type I2cBitrateOutput = Readonly<{
  readonly bitsPerSecond: number;
}>;

export const calculateI2cBitrate = (x: I2cBitrateInput): I2cBitrateOutput => {
  if (!Number.isFinite(x.highSeconds) || x.highSeconds < 0)
    simpleError("highSeconds", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lowSeconds) || x.lowSeconds < 0)
    simpleError("lowSeconds", "Provide a finite number at least 0.");
  const bitsPerSecond = 1 / (x.highSeconds + x.lowSeconds);
  if (!Number.isFinite(bitsPerSecond))
    simpleError(
      "bitsPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { bitsPerSecond: Object.is(bitsPerSecond, -0) ? 0 : bitsPerSecond };
};

export const example = {
  input: { highSeconds: 0.000005, lowSeconds: 0.000005 },
  output: { bitsPerSecond: 99999.99999999999 },
} satisfies ToolExample<I2cBitrateInput, I2cBitrateOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/i2c-bitrate",
  title: "I2C Bitrate",
  description:
    "Observed I²C SCL bit rate from measured high and low periods of one complete clock pulse.",
  inputs: [
    {
      id: "highSeconds",
      kind: "number",
      label: "High Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "lowSeconds",
      kind: "number",
      label: "Low Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "bitsPerSecond",
      kind: "number",
      label: "Bits Per Second",
      unit: "bit/s",
    },
  ],
  calculate: (input) =>
    calculateI2cBitrate({
      highSeconds: input.highSeconds as number,
      lowSeconds: input.lowSeconds as number,
    }),
});
export const i2cBitrateTool = tool;
export const runI2cBitrate = tool.execute;
export default tool;
