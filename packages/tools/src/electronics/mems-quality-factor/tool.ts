import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MemsQualityFactorInput = Readonly<{
  readonly resonantFrequencyHz: number;
  readonly lowerHalfPowerHz: number;
  readonly upperHalfPowerHz: number;
}>;
export type MemsQualityFactorOutput = Readonly<{
  readonly qualityFactor: number;
}>;

export const calculateMemsQualityFactor = (
  x: MemsQualityFactorInput,
): MemsQualityFactorOutput => {
  if (!Number.isFinite(x.resonantFrequencyHz) || x.resonantFrequencyHz < 0)
    simpleError("resonantFrequencyHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lowerHalfPowerHz) || x.lowerHalfPowerHz < 0)
    simpleError("lowerHalfPowerHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.upperHalfPowerHz) || x.upperHalfPowerHz < 0)
    simpleError("upperHalfPowerHz", "Provide a finite number at least 0.");
  if (!(
    x.resonantFrequencyHz > 0 &&
    x.upperHalfPowerHz > x.lowerHalfPowerHz &&
    x.lowerHalfPowerHz < x.resonantFrequencyHz &&
    x.resonantFrequencyHz < x.upperHalfPowerHz
  ))
    simpleError(
      "input",
      "Half-power frequencies must bracket a positive resonance.",
    );
  const qualityFactor =
    x.resonantFrequencyHz / (x.upperHalfPowerHz - x.lowerHalfPowerHz);
  if (!Number.isFinite(qualityFactor))
    simpleError("qualityFactor", "The inputs produce an invalid result.");
  return { qualityFactor: Object.is(qualityFactor, -0) ? 0 : qualityFactor };
};

export const example = {
  input: {
    resonantFrequencyHz: 1000,
    lowerHalfPowerHz: 950,
    upperHalfPowerHz: 1050,
  },
  output: { qualityFactor: 10 },
} satisfies ToolExample<MemsQualityFactorInput, MemsQualityFactorOutput>;

export const tool = createSimpleTool({
  id: "electronics/mems-quality-factor",
  title: "MEMS Quality Factor",
  description:
    "Calculate a MEMS resonance quality factor from peak frequency and the two measured half-power frequencies.",
  inputs: [
    {
      id: "resonantFrequencyHz",
      kind: "number",
      label: "Resonance frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "lowerHalfPowerHz",
      kind: "number",
      label: "Lower half-power frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "upperHalfPowerHz",
      kind: "number",
      label: "Upper half-power frequency",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "qualityFactor", kind: "number", label: "Resonance quality factor" },
  ],
  calculate: (input) =>
    calculateMemsQualityFactor({
      resonantFrequencyHz: input.resonantFrequencyHz as number,
      lowerHalfPowerHz: input.lowerHalfPowerHz as number,
      upperHalfPowerHz: input.upperHalfPowerHz as number,
    }),
});
export const memsQualityFactorTool = tool;
export const runMemsQualityFactor = tool.execute;
export default tool;
