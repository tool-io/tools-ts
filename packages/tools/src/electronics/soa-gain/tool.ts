import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoaGainInput = Readonly<{
  readonly outputPowerW: number;
  readonly inputPowerW: number;
}>;
export type SoaGainOutput = Readonly<{
  readonly gainDb: number;
}>;

export const calculateSoaGain = (x: SoaGainInput): SoaGainOutput => {
  if (!Number.isFinite(x.outputPowerW) || x.outputPowerW < 0)
    simpleError("outputPowerW", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.inputPowerW) || x.inputPowerW < 0)
    simpleError("inputPowerW", "Provide a finite number at least 0.");
  if (!(x.inputPowerW > 0 && x.outputPowerW > 0))
    simpleError("input", "Both optical powers must be positive.");
  const gainDb = 10 * Math.log10(x.outputPowerW / x.inputPowerW);
  if (!Number.isFinite(gainDb))
    simpleError("gainDb", "The inputs produce an invalid result.");
  return { gainDb: Object.is(gainDb, -0) ? 0 : gainDb };
};

export const example = {
  input: { outputPowerW: 0.01, inputPowerW: 0.001 },
  output: { gainDb: 10 },
} satisfies ToolExample<SoaGainInput, SoaGainOutput>;

export const tool = createSimpleTool({
  id: "electronics/soa-gain",
  title: "SOA Gain",
  description:
    "Convert a semiconductor optical amplifier's output-to-input optical power ratio to power gain in decibels.",
  inputs: [
    {
      id: "outputPowerW",
      kind: "number",
      label: "Output optical power",
      unit: "W",
      minimum: 0,
    },
    {
      id: "inputPowerW",
      kind: "number",
      label: "Input optical power",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "gainDb", kind: "number", label: "Optical power gain", unit: "dB" },
  ],
  calculate: (input) =>
    calculateSoaGain({
      outputPowerW: input.outputPowerW as number,
      inputPowerW: input.inputPowerW as number,
    }),
});
export const soaGainTool = tool;
export const runSoaGain = tool.execute;
export default tool;
