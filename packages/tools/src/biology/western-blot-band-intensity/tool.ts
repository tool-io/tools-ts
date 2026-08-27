import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const westernBlotBandIntensityExample = {
  input: { loadingControlIntensity: 500, targetBandIntensity: 750 },
  output: { normalizedRatio: 1.5 },
} satisfies ToolExample<
  {
    readonly loadingControlIntensity: number;
    readonly targetBandIntensity: number;
  },
  { readonly normalizedRatio: number }
>;

export const westernBlotBandIntensityTool = createSimpleTool({
  id: "biology/western-blot-band-intensity",
  title: "Band Intensity Ratio",
  description:
    "Normalise a western blot target band by dividing its densitometry intensity by the loading control intensity of the same lane.",
  inputs: [
    {
      description:
        "Densitometry intensity of the target protein band; must not be negative.",
      id: "targetBandIntensity",
      label: "Target band intensity",
      kind: "number",
      minimum: 0,
    },
    {
      description:
        "Densitometry intensity of the loading control band; must be greater than zero.",
      id: "loadingControlIntensity",
      label: "Loading control intensity",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Target band intensity normalised to the loading control.",
      id: "normalizedRatio",
      label: "Normalized ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const targetBandIntensity = input.targetBandIntensity as number;
    const loadingControlIntensity = input.loadingControlIntensity as number;
    if (!(loadingControlIntensity > 0))
      simpleError(
        "loadingControlIntensity",
        "The loading control intensity must be greater than zero.",
        "invalid_control",
      );
    return { normalizedRatio: targetBandIntensity / loadingControlIntensity };
  },
});
export const runWesternBlotBandIntensity = westernBlotBandIntensityTool.execute;
export default westernBlotBandIntensityTool;
