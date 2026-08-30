import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorDissipationFactorVsFrequencyInput = Readonly<{
  readonly frequencyHz: number;
  readonly capacitanceFarads: number;
  readonly seriesResistanceOhms: number;
}>;
export type CapacitorDissipationFactorVsFrequencyOutput = Readonly<{
  readonly dissipationFactor: number;
}>;

export const calculateCapacitorDissipationFactorVsFrequency = (
  x: CapacitorDissipationFactorVsFrequencyInput,
): CapacitorDissipationFactorVsFrequencyOutput => {
  if (!Number.isFinite(x.frequencyHz) || x.frequencyHz < 0)
    simpleError("frequencyHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.capacitanceFarads) || x.capacitanceFarads < 0)
    simpleError("capacitanceFarads", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.seriesResistanceOhms) || x.seriesResistanceOhms < 0)
    simpleError("seriesResistanceOhms", "Provide a finite number at least 0.");
  const dissipationFactor =
    2 * Math.PI * x.frequencyHz * x.capacitanceFarads * x.seriesResistanceOhms;
  if (!Number.isFinite(dissipationFactor))
    simpleError(
      "dissipationFactor",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    dissipationFactor: Object.is(dissipationFactor, -0) ? 0 : dissipationFactor,
  };
};

export const example = {
  input: {
    frequencyHz: 1000,
    capacitanceFarads: 0.000001,
    seriesResistanceOhms: 2,
  },
  output: { dissipationFactor: 0.012566370614359171 },
} satisfies ToolExample<
  CapacitorDissipationFactorVsFrequencyInput,
  CapacitorDissipationFactorVsFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/capacitor-dissipation-factor-vs-frequency",
  title: "Capacitor Dissipation Factor Vs Frequency",
  description:
    "Loss tangent of a series-ESR capacitor at a specified frequency; excludes dielectric frequency dispersion.",
  inputs: [
    {
      id: "frequencyHz",
      kind: "number",
      label: "Frequency Hz",
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
      id: "seriesResistanceOhms",
      kind: "number",
      label: "Series Resistance Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "dissipationFactor", kind: "number", label: "Dissipation Factor" },
  ],
  calculate: (input) =>
    calculateCapacitorDissipationFactorVsFrequency({
      frequencyHz: input.frequencyHz as number,
      capacitanceFarads: input.capacitanceFarads as number,
      seriesResistanceOhms: input.seriesResistanceOhms as number,
    }),
});
export const capacitorDissipationFactorVsFrequencyTool = tool;
export const runCapacitorDissipationFactorVsFrequency = tool.execute;
export default tool;
