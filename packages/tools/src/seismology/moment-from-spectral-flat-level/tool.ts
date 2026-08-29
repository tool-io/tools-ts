import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const momentFromSpectralFlatLevelExample = {
  input: {
    omega0NmS: 0.000001,
    densityKgM3: 2700,
    betaKmS: 3.5,
    partitionFactor: 2.83,
  },
  output: { seismicMomentNm: 514033384.5387822 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const momentFromSpectralFlatLevelTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ omega0NmS, densityKgM3, betaKmS, partitionFactor }) => {
      if (!(omega0NmS > 0))
        simpleError("omega0NmS", "Spectral level must be positive.");
      if (!(densityKgM3 > 0))
        simpleError("densityKgM3", "Density must be positive.");
      if (!(betaKmS > 0))
        simpleError("betaKmS", "Shear-wave velocity must be positive.");
      if (!(partitionFactor > 0))
        simpleError("partitionFactor", "Partition factor must be positive.");
      return {
        seismicMomentNm:
          (4 *
            Math.PI *
            densityKgM3 *
            Math.pow(betaKmS * 1000, 3) *
            omega0NmS) /
          partitionFactor,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Compute seismic moment from the low-frequency spectral plateau Ω₀ using the Brune spectral model.",
  id: "seismology/moment-from-spectral-flat-level",
  inputs: [
    {
      minimum: 0,
      description: "Low-frequency spectral level.",
      id: "omega0NmS",
      kind: "number",
      label: "Ω₀",
      unit: "N·m·s",
    },
    {
      default: 2700,
      description: "Crustal density.",
      id: "densityKgM3",
      kind: "number",
      label: "ρ",
      unit: "kg/m³",
    },
    {
      default: 3.5,
      description: "Shear wave velocity.",
      id: "betaKmS",
      kind: "number",
      label: "β",
      unit: "km/s",
    },
    {
      default: 2.83,
      description: "Radiation partition factor.",
      id: "partitionFactor",
      kind: "number",
      label: "S_p",
    },
  ],
  outputs: [
    {
      description: "Seismic moment.",
      id: "seismicMomentNm",
      kind: "number",
      label: "M₀",
      unit: "N·m",
    },
  ],
  title: "Moment From Spectral Flat Level Calculator",
});
export const runMomentFromSpectralFlatLevel =
  momentFromSpectralFlatLevelTool.execute;
export { momentFromSpectralFlatLevelExample as example };
export default momentFromSpectralFlatLevelTool;
