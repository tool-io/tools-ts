import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DifferentialModeFilterAttenuationInput = Readonly<{
  readonly filterResistanceOhms: number;
  readonly filterReactanceOhms: number;
  readonly loadResistanceOhms: number;
}>;
export type DifferentialModeFilterAttenuationOutput = Readonly<{
  attenuationDb: number;
}>;

export const calculateDifferentialModeFilterAttenuation = (
  i: DifferentialModeFilterAttenuationInput,
): DifferentialModeFilterAttenuationOutput => {
  const value =
    20 *
    Math.log10(
      Math.hypot(
        i.loadResistanceOhms + i.filterResistanceOhms,
        i.filterReactanceOhms,
      ) / i.loadResistanceOhms,
    );
  if (!Number.isFinite(value))
    simpleError("attenuationDb", "The inputs produce a non-finite result.");
  return { attenuationDb: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    filterResistanceOhms: 20,
    filterReactanceOhms: 100,
    loadResistanceOhms: 50,
  },
  output: { attenuationDb: 7.752462597402364 },
} satisfies ToolExample<
  DifferentialModeFilterAttenuationInput,
  DifferentialModeFilterAttenuationOutput
>;

export const tool = createSimpleTool({
  id: "electronics/differential-mode-filter-attenuation",
  title: "Differential Mode Filter Attenuation",
  description:
    "Estimate differential-mode series-filter insertion loss into a resistive load from measured complex differential-mode impedance at the selected frequency; source impedance is assumed zero.",
  inputs: [
    {
      id: "filterResistanceOhms",
      kind: "number",
      label: "Filter Resistance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "filterReactanceOhms",
      kind: "number",
      label: "Filter Reactance (Ω)",
      unit: "Ω",
    },
    {
      id: "loadResistanceOhms",
      kind: "number",
      label: "Load Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "attenuationDb",
      kind: "number",
      label: "Attenuation (dB)",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateDifferentialModeFilterAttenuation({
      filterResistanceOhms: input.filterResistanceOhms as number,
      filterReactanceOhms: input.filterReactanceOhms as number,
      loadResistanceOhms: input.loadResistanceOhms as number,
    }),
});
export const differentialModeFilterAttenuationTool = tool;
export const runDifferentialModeFilterAttenuation = tool.execute;
export default tool;
