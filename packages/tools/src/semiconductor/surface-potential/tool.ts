import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SurfacePotentialInput = {
  readonly dopingPerCm3: number;
  readonly intrinsicConc: number;
  readonly temperatureKelvin?: number;
};

export type SurfacePotentialOutput = {
  readonly surfacePotentialVolts: number;
};

export const surfacePotentialExample = {
  input: { dopingPerCm3: 1e17, intrinsicConc: 1e10 },
  output: { surfacePotentialVolts: 0.8333700106386042 },
} satisfies ToolExample<SurfacePotentialInput, SurfacePotentialOutput>;

export const surfacePotentialTool = createSimpleTool({
  id: "semiconductor/surface-potential",
  title: "Surface Potential Calculator",
  description:
    "Compute the magnitude of the strong-inversion MOS surface potential, 2 phi-F, from substrate doping, intrinsic carrier concentration, and temperature.",
  inputs: [
    {
      id: "dopingPerCm3",
      label: "Doping concentration",
      kind: "number",
      minimum: 0,
      unit: "cm^-3",
      format: "density-per-cm3",
      description: "Substrate doping concentration.",
    },
    {
      default: 300,
      description: "Absolute device temperature.",
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature",
      unit: "K",
    },
    {
      id: "intrinsicConc",
      label: "Intrinsic concentration",
      kind: "number",
      minimum: 0,
      unit: "cm^-3",
      format: "density-per-cm3",
      description: "Intrinsic carrier concentration.",
    },
  ],
  outputs: [
    {
      id: "surfacePotentialVolts",
      label: "Surface potential",
      kind: "number",
      unit: "V",
      description: "Strong-inversion surface potential psi_s.",
    },
  ],
  calculate: (input) => {
    const dopingPerCm3 = input.dopingPerCm3 as number;
    const intrinsicConc = input.intrinsicConc as number;
    if (dopingPerCm3 <= 0)
      simpleError(
        "dopingPerCm3",
        "Doping concentration must be positive.",
        "invalid_doping",
      );
    if (intrinsicConc <= 0)
      simpleError(
        "intrinsicConc",
        "Intrinsic concentration must be positive.",
        "invalid_intrinsic_conc",
      );
    if (!(dopingPerCm3 > intrinsicConc))
      simpleError(
        "dopingPerCm3",
        "Doping concentration must exceed intrinsic concentration for this strong-inversion model.",
        "not_extrinsic",
      );
    const temperatureKelvin = input.temperatureKelvin as number;
    if (!(temperatureKelvin > 0))
      simpleError("temperatureKelvin", "Temperature must be positive.");
    return {
      surfacePotentialVolts:
        2 *
        8.617333262e-5 *
        temperatureKelvin *
        (Math.log(dopingPerCm3) - Math.log(intrinsicConc)),
    };
  },
});
export const runSurfacePotential = surfacePotentialTool.execute;
export default surfacePotentialTool;
