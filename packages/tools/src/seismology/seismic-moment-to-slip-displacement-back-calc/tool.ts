import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const seismicMomentToSlipDisplacementBackCalcExample = {
  input: {
    seismicMomentNm: 6000000000000000000,
    areaKm2: 1000,
    rigidityGPa: 30,
  },
  output: { averageSlipM: 0.2 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const seismicMomentToSlipDisplacementBackCalcTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ seismicMomentNm, areaKm2, rigidityGPa }) => {
      if (areaKm2 <= 0) simpleError("areaKm2", "Area must be positive.");
      if (seismicMomentNm <= 0)
        simpleError("seismicMomentNm", "Seismic moment must be positive.");
      if (rigidityGPa <= 0)
        simpleError("rigidityGPa", "Rigidity must be positive.");
      return {
        averageSlipM: seismicMomentNm / (rigidityGPa * 1e9 * areaKm2 * 1e6),
      };
    })(input as never) as Record<string, unknown>,
  description: "Average slip from moment and area: D = M₀/(μ·A).",
  id: "seismology/seismic-moment-to-slip-displacement-back-calc",
  inputs: [
    {
      minimum: 0,
      description: "Seismic moment.",
      id: "seismicMomentNm",
      kind: "number",
      label: "M₀",
      unit: "N·m",
    },
    {
      minimum: 0,
      description: "Rupture area.",
      id: "areaKm2",
      kind: "number",
      label: "A",
      unit: "km²",
    },
    {
      default: 30,
      minimum: 0,
      description: "Rigidity.",
      id: "rigidityGPa",
      kind: "number",
      label: "μ",
      unit: "GPa",
    },
  ],
  outputs: [
    {
      description: "Mean slip.",
      id: "averageSlipM",
      kind: "number",
      label: "D",
      unit: "m",
    },
  ],
  title: "Seismic Moment To Slip Displacement Back Calc",
});
export const runSeismicMomentToSlipDisplacementBackCalc =
  seismicMomentToSlipDisplacementBackCalcTool.execute;
export { seismicMomentToSlipDisplacementBackCalcExample as example };
export default seismicMomentToSlipDisplacementBackCalcTool;
