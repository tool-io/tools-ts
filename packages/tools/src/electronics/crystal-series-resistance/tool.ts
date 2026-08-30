import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrystalSeriesResistanceInput = Readonly<{
  readonly seriesFrequencyHz: number;
  readonly motionalCapacitanceF: number;
  readonly qualityFactor: number;
}>;
export type CrystalSeriesResistanceOutput = Readonly<{
  readonly seriesResistanceOhm: number;
}>;

export const calculateCrystalSeriesResistance = (
  x: CrystalSeriesResistanceInput,
): CrystalSeriesResistanceOutput => {
  if (!Number.isFinite(x.seriesFrequencyHz) || x.seriesFrequencyHz < 0)
    simpleError("seriesFrequencyHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.motionalCapacitanceF) || x.motionalCapacitanceF < 0)
    simpleError("motionalCapacitanceF", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.qualityFactor) || x.qualityFactor < 0)
    simpleError("qualityFactor", "Provide a finite number at least 0.");
  if (!(
    x.seriesFrequencyHz > 0 &&
    x.motionalCapacitanceF > 0 &&
    x.qualityFactor > 0
  ))
    simpleError("input", "Frequency, capacitance, and Q must be positive.");
  const seriesResistanceOhm =
    1 /
    (2 *
      Math.PI *
      x.seriesFrequencyHz *
      x.motionalCapacitanceF *
      x.qualityFactor);
  if (!Number.isFinite(seriesResistanceOhm))
    simpleError("seriesResistanceOhm", "The inputs produce an invalid result.");
  return {
    seriesResistanceOhm: Object.is(seriesResistanceOhm, -0)
      ? 0
      : seriesResistanceOhm,
  };
};

export const example = {
  input: {
    seriesFrequencyHz: 10000000,
    motionalCapacitanceF: 1e-14,
    qualityFactor: 100000,
  },
  output: { seriesResistanceOhm: 15.915494309189533 },
} satisfies ToolExample<
  CrystalSeriesResistanceInput,
  CrystalSeriesResistanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/crystal-series-resistance",
  title: "Crystal Series Resistance",
  description:
    "Infer crystal motional series resistance from series frequency, motional capacitance, and unloaded series quality factor.",
  inputs: [
    {
      id: "seriesFrequencyHz",
      kind: "number",
      label: "Series resonance frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "motionalCapacitanceF",
      kind: "number",
      label: "Motional capacitance",
      unit: "F",
      minimum: 0,
    },
    {
      id: "qualityFactor",
      kind: "number",
      label: "Series quality factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "seriesResistanceOhm",
      kind: "number",
      label: "Motional series resistance",
      unit: "Ω",
    },
  ],
  calculate: (input) =>
    calculateCrystalSeriesResistance({
      seriesFrequencyHz: input.seriesFrequencyHz as number,
      motionalCapacitanceF: input.motionalCapacitanceF as number,
      qualityFactor: input.qualityFactor as number,
    }),
});
export const crystalSeriesResistanceTool = tool;
export const runCrystalSeriesResistance = tool.execute;
export default tool;
