import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CommonModeFilterAttenuationInput = Readonly<{
  readonly filterResistanceOhms: number;
  readonly filterReactanceOhms: number;
  readonly loadResistanceOhms: number;
}>;
export type CommonModeFilterAttenuationOutput = Readonly<{
  attenuationDb: number;
}>;

export const calculateCommonModeFilterAttenuation = (
  i: CommonModeFilterAttenuationInput,
): CommonModeFilterAttenuationOutput => {
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
    filterResistanceOhms: 100,
    filterReactanceOhms: 0,
    loadResistanceOhms: 100,
  },
  output: { attenuationDb: 6.020599913279624 },
} satisfies ToolExample<
  CommonModeFilterAttenuationInput,
  CommonModeFilterAttenuationOutput
>;

export const tool = createSimpleTool({
  id: "electronics/common-mode-filter-attenuation",
  title: "Common Mode Filter Attenuation",
  description:
    "Estimate common-mode series-filter insertion loss into a resistive load from measured complex common-mode impedance at the selected frequency; source impedance is assumed zero.",
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
    calculateCommonModeFilterAttenuation({
      filterResistanceOhms: input.filterResistanceOhms as number,
      filterReactanceOhms: input.filterReactanceOhms as number,
      loadResistanceOhms: input.loadResistanceOhms as number,
    }),
});
export const commonModeFilterAttenuationTool = tool;
export const runCommonModeFilterAttenuation = tool.execute;
export default tool;
