import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VaractorQualityFactorInput = Readonly<{
  readonly frequencyHertz: number;
  readonly capacitanceFarads: number;
  readonly seriesOhms: number;
}>;
export type VaractorQualityFactorOutput = Readonly<{
  readonly qualityFactor: number;
}>;

export const calculateVaractorQualityFactor = (
  x: VaractorQualityFactorInput,
): VaractorQualityFactorOutput => {
  if (!Number.isFinite(x.frequencyHertz) || x.frequencyHertz < 0)
    simpleError("frequencyHertz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.capacitanceFarads) || x.capacitanceFarads < 0)
    simpleError("capacitanceFarads", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.seriesOhms) || x.seriesOhms < 0)
    simpleError("seriesOhms", "Provide a finite number at least 0.");
  const qualityFactor =
    1 / (2 * Math.PI * x.frequencyHertz * x.capacitanceFarads * x.seriesOhms);
  if (!Number.isFinite(qualityFactor))
    simpleError(
      "qualityFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { qualityFactor: Object.is(qualityFactor, -0) ? 0 : qualityFactor };
};

export const example = {
  input: {
    frequencyHertz: 1000000000,
    capacitanceFarads: 1e-12,
    seriesOhms: 1,
  },
  output: { qualityFactor: 159.15494309189532 },
} satisfies ToolExample<
  VaractorQualityFactorInput,
  VaractorQualityFactorOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/varactor-quality-factor",
  title: "Varactor Quality Factor",
  description:
    "Series-loss quality factor of a varactor at a specified frequency from capacitance and effective series resistance.",
  inputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance Farads",
      unit: "F",
      minimum: 0,
    },
    {
      id: "seriesOhms",
      kind: "number",
      label: "Series Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [{ id: "qualityFactor", kind: "number", label: "Quality Factor" }],
  calculate: (input) =>
    calculateVaractorQualityFactor({
      frequencyHertz: input.frequencyHertz as number,
      capacitanceFarads: input.capacitanceFarads as number,
      seriesOhms: input.seriesOhms as number,
    }),
});
export const varactorQualityFactorTool = tool;
export const runVaractorQualityFactor = tool.execute;
export default tool;
