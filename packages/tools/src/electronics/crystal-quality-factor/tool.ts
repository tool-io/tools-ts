import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrystalQualityFactorInput = Readonly<{
  readonly seriesFrequencyHz: number;
  readonly motionalInductanceH: number;
  readonly seriesResistanceOhm: number;
}>;
export type CrystalQualityFactorOutput = Readonly<{
  readonly qualityFactor: number;
}>;

export const calculateCrystalQualityFactor = (
  x: CrystalQualityFactorInput,
): CrystalQualityFactorOutput => {
  if (!Number.isFinite(x.seriesFrequencyHz) || x.seriesFrequencyHz < 0)
    simpleError("seriesFrequencyHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.motionalInductanceH) || x.motionalInductanceH < 0)
    simpleError("motionalInductanceH", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.seriesResistanceOhm) || x.seriesResistanceOhm < 0)
    simpleError("seriesResistanceOhm", "Provide a finite number at least 0.");
  if (!(
    x.seriesFrequencyHz > 0 &&
    x.motionalInductanceH > 0 &&
    x.seriesResistanceOhm > 0
  ))
    simpleError(
      "input",
      "Frequency, inductance, and resistance must be positive.",
    );
  const qualityFactor =
    (2 * Math.PI * x.seriesFrequencyHz * x.motionalInductanceH) /
    x.seriesResistanceOhm;
  if (!Number.isFinite(qualityFactor))
    simpleError("qualityFactor", "The inputs produce an invalid result.");
  return { qualityFactor: Object.is(qualityFactor, -0) ? 0 : qualityFactor };
};

export const example = {
  input: {
    seriesFrequencyHz: 10000000,
    motionalInductanceH: 1,
    seriesResistanceOhm: 100,
  },
  output: { qualityFactor: 628318.5307179587 },
} satisfies ToolExample<CrystalQualityFactorInput, CrystalQualityFactorOutput>;

export const tool = createSimpleTool({
  id: "electronics/crystal-quality-factor",
  title: "Crystal Quality Factor",
  description:
    "Calculate a crystal motional branch's unloaded series Q from series frequency, motional inductance, and series resistance.",
  inputs: [
    {
      id: "seriesFrequencyHz",
      kind: "number",
      label: "Series resonance frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "motionalInductanceH",
      kind: "number",
      label: "Motional inductance",
      unit: "H",
      minimum: 0,
    },
    {
      id: "seriesResistanceOhm",
      kind: "number",
      label: "Motional series resistance",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "qualityFactor", kind: "number", label: "Unloaded series Q" },
  ],
  calculate: (input) =>
    calculateCrystalQualityFactor({
      seriesFrequencyHz: input.seriesFrequencyHz as number,
      motionalInductanceH: input.motionalInductanceH as number,
      seriesResistanceOhm: input.seriesResistanceOhm as number,
    }),
});
export const crystalQualityFactorTool = tool;
export const runCrystalQualityFactor = tool.execute;
export default tool;
