import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagneticFluxDensityInput = {
  readonly fluxWb: number;
  readonly areaM2: number;
};

export type MagneticFluxDensityOutput = {
  readonly fluxDensityTesla: number;
};

export const magneticFluxDensityExample = {
  input: { fluxWb: 3, areaM2: 1.5 },
  output: { fluxDensityTesla: 2 },
} satisfies ToolExample<MagneticFluxDensityInput, MagneticFluxDensityOutput>;

export const magneticFluxDensityTool = createSimpleTool({
  id: "electronics/magnetic-flux-density",
  title: "Flux Density Tesla",
  description:
    "Compute flux density in teslas as magnetic flux in webers divided by area in square meters.",
  inputs: [
    { id: "fluxWb", label: "Magnetic flux", kind: "number", unit: "Wb" },
    { id: "areaM2", label: "Area", kind: "number", unit: "m²" },
  ],
  outputs: [
    {
      id: "fluxDensityTesla",
      label: "Flux density",
      kind: "number",
      unit: "T",
    },
  ],
  calculate: (input) => {
    const areaM2 = input.areaM2 as number;
    if (!(areaM2 > 0))
      simpleError("areaM2", "Area must be positive.", "invalid_area");
    return { fluxDensityTesla: (input.fluxWb as number) / areaM2 };
  },
});
export const runMagneticFluxDensity = magneticFluxDensityTool.execute;
export default magneticFluxDensityTool;
