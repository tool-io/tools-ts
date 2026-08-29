import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const seismicLandslideAreaVolumeScalingExample = {
  input: { planAreaM2: 10000 },
  output: { volumeM3: 47952.75818049467, equivalentDepthM: 4.795275818049467 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const seismicLandslideAreaVolumeScalingTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ planAreaM2, alphaCoefficient, gammaExponent }) => {
      const alpha = alphaCoefficient ?? 0.076;
      const gamma = gammaExponent ?? 1.45;
      if (!(planAreaM2 > 0))
        simpleError("planAreaM2", "Plan area must be positive.");
      if (!(alpha > 0))
        simpleError(
          "alphaCoefficient",
          "Scaling coefficient must be positive.",
        );
      if (!(gamma > 0))
        simpleError("gammaExponent", "Scaling exponent must be positive.");
      const volumeM3 = alpha * Math.pow(planAreaM2, gamma);
      return { volumeM3, equivalentDepthM: volumeM3 / planAreaM2 };
    })(input as never) as Record<string, unknown>,
  description:
    "Empirical area-volume scaling for seismically triggered landslides: V = α·A^γ (Guzzetti-like).",
  id: "seismology/seismic-landslide-area-volume-scaling",
  inputs: [
    {
      minimum: 0,
      description: "Plan-view scar area.",
      id: "planAreaM2",
      kind: "number",
      label: "A",
      unit: "m²",
    },
    {
      default: 0.076,
      description: "Scaling prefactor.",
      id: "alphaCoefficient",
      kind: "number",
      label: "α",
    },
    {
      default: 1.45,
      description: "Scaling exponent.",
      id: "gammaExponent",
      kind: "number",
      label: "γ",
    },
  ],
  outputs: [
    {
      description: "Estimated mobilized volume.",
      id: "volumeM3",
      kind: "number",
      label: "V",
      unit: "m³",
    },
    {
      description: "Volume-over-area equivalent depth.",
      id: "equivalentDepthM",
      kind: "number",
      label: "d_eq",
      unit: "m",
    },
  ],
  title: "Seismic Landslide Area Volume Scaling Calculator",
});
export const runSeismicLandslideAreaVolumeScaling =
  seismicLandslideAreaVolumeScalingTool.execute;
export { seismicLandslideAreaVolumeScalingExample as example };
export default seismicLandslideAreaVolumeScalingTool;
