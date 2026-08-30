import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Pa1dbCompressionInput = Readonly<{
  readonly compressedOutputDbm: number;
  readonly smallSignalGainDb: number;
}>;
export type Pa1dbCompressionOutput = Readonly<{
  readonly inputP1dbDbm: number;
}>;

export const calculatePa1dbCompression = (
  x: Pa1dbCompressionInput,
): Pa1dbCompressionOutput => {
  if (!Number.isFinite(x.compressedOutputDbm))
    simpleError("compressedOutputDbm", "Provide a finite number.");
  if (!Number.isFinite(x.smallSignalGainDb))
    simpleError("smallSignalGainDb", "Provide a finite number.");
  const inputP1dbDbm = x.compressedOutputDbm - x.smallSignalGainDb + 1;
  if (!Number.isFinite(inputP1dbDbm))
    simpleError(
      "inputP1dbDbm",
      "Inputs produce an undefined or non-finite result.",
    );
  return { inputP1dbDbm: Object.is(inputP1dbDbm, -0) ? 0 : inputP1dbDbm };
};

export const example = {
  input: { compressedOutputDbm: 30, smallSignalGainDb: 20 },
  output: { inputP1dbDbm: 11 },
} satisfies ToolExample<Pa1dbCompressionInput, Pa1dbCompressionOutput>;

export const tool = createSimpleTool({
  id: "electronics/pa-1db-compression",
  title: "PA 1db Compression",
  description:
    "Input power at the measured one-decibel gain compression point from output power and small-signal gain.",
  inputs: [
    {
      id: "compressedOutputDbm",
      kind: "number",
      label: "Compressed Output Dbm",
      unit: "dBm",
    },
    {
      id: "smallSignalGainDb",
      kind: "number",
      label: "Small Signal Gain Db",
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "inputP1dbDbm",
      kind: "number",
      label: "Input P1db Dbm",
      unit: "dBm",
    },
  ],
  calculate: (input) =>
    calculatePa1dbCompression({
      compressedOutputDbm: input.compressedOutputDbm as number,
      smallSignalGainDb: input.smallSignalGainDb as number,
    }),
});
export const pa1dbCompressionTool = tool;
export const runPa1dbCompression = tool.execute;
export default tool;
