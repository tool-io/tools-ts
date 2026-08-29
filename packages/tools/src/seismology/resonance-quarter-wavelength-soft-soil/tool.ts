import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const resonanceQuarterWavelengthSoftSoilExample = {
  input: { layerThicknessM: 25, shearVelocityMS: 200 },
  output: { resonantFrequencyHz: 2, resonantPeriodS: 0.5 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const resonanceQuarterWavelengthSoftSoilTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ layerThicknessM, shearVelocityMS }) => {
      if (!(layerThicknessM > 0))
        simpleError("layerThicknessM", "Layer thickness must be positive.");
      if (!(shearVelocityMS > 0))
        simpleError("shearVelocityMS", "Shear-wave velocity must be positive.");
      const f0 = shearVelocityMS / (4 * layerThicknessM);
      return { resonantFrequencyHz: f0, resonantPeriodS: 1 / f0 };
    })(input as never) as Record<string, unknown>,
  description:
    "Soft-soil resonant frequency f₀ = Vs/(4H) for a layer over rigid bedrock.",
  id: "seismology/resonance-quarter-wavelength-soft-soil",
  inputs: [
    {
      minimum: 0,
      description: "Layer thickness.",
      id: "layerThicknessM",
      kind: "number",
      label: "H",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Layer shear velocity.",
      id: "shearVelocityMS",
      kind: "number",
      label: "Vs",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Fundamental resonant frequency.",
      id: "resonantFrequencyHz",
      kind: "number",
      label: "f₀",
      unit: "Hz",
    },
    {
      description: "Resonant period.",
      id: "resonantPeriodS",
      kind: "number",
      label: "T₀",
      unit: "s",
    },
  ],
  title: "Resonance Quarter Wavelength Soft Soil Calculator",
});
export const runResonanceQuarterWavelengthSoftSoil =
  resonanceQuarterWavelengthSoftSoilTool.execute;
export { resonanceQuarterWavelengthSoftSoilExample as example };
export default resonanceQuarterWavelengthSoftSoilTool;
