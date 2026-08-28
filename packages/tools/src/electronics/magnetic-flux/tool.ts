import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagneticFluxInput = {
  readonly fluxDensityTesla: number;
  readonly areaM2: number;
};

export type MagneticFluxOutput = {
  readonly magneticFluxWb: number;
};

export const magneticFluxExample = {
  input: { fluxDensityTesla: 2, areaM2: 0.5 },
  output: { magneticFluxWb: 1 },
} satisfies ToolExample<MagneticFluxInput, MagneticFluxOutput>;

export const magneticFluxTool = createSimpleTool({
  id: "electronics/magnetic-flux",
  title: "Magnetic Flux Wb",
  description:
    "Compute magnetic flux in webers as flux density in teslas multiplied by area in square meters.",
  inputs: [
    {
      id: "fluxDensityTesla",
      label: "Flux density",
      kind: "number",
      unit: "T",
    },
    { id: "areaM2", label: "Area", kind: "number", unit: "m²" },
  ],
  outputs: [
    {
      id: "magneticFluxWb",
      label: "Magnetic flux",
      kind: "number",
      unit: "Wb",
    },
  ],
  calculate: (input) => {
    const fluxDensityTesla = input.fluxDensityTesla as number;
    const areaM2 = input.areaM2 as number;
    if (!(fluxDensityTesla >= 0))
      simpleError(
        "fluxDensityTesla",
        "Flux density must not be negative.",
        "invalid_flux_density",
      );
    if (!(areaM2 > 0))
      simpleError("areaM2", "Area must be positive.", "invalid_area");
    return { magneticFluxWb: fluxDensityTesla * areaM2 };
  },
});
export const runMagneticFlux = magneticFluxTool.execute;
export default magneticFluxTool;
