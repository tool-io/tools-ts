import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ruptureVelocityShearWaveRatioCheckerExample = {
  input: { ruptureVelocityKmS: 2.45 },
  output: { ratioVrVs: 0.7000000000000001, regime: "sub-shear" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const ruptureVelocityShearWaveRatioCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ ruptureVelocityKmS, shearWaveVelocityKmS }) => {
      if (!(shearWaveVelocityKmS > 0))
        simpleError(
          "shearWaveVelocityKmS",
          "Shear-wave velocity must be positive.",
        );
      const ratioVrVs = ruptureVelocityKmS / shearWaveVelocityKmS;
      return {
        ratioVrVs,
        regime:
          ratioVrVs < 1
            ? "sub-shear"
            : ratioVrVs === 1
              ? "at shear-wave speed"
              : "super-shear",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Classify rupture velocity as sub-shear or super-shear relative to β.",
  id: "seismology/rupture-velocity-shear-wave-ratio-checker",
  inputs: [
    {
      minimum: 0,
      description: "Rupture velocity.",
      id: "ruptureVelocityKmS",
      kind: "number",
      label: "v_r",
      unit: "km/s",
    },
    {
      default: 3.5,
      description: "Shear wave velocity.",
      id: "shearWaveVelocityKmS",
      kind: "number",
      label: "β",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Velocity ratio.",
      id: "ratioVrVs",
      kind: "number",
      label: "v_r/v_s",
    },
    {
      description: "Rupture regime classification.",
      id: "regime",
      kind: "string",
      label: "Regime",
    },
  ],
  title: "Rupture Velocity Shear Wave Ratio Checker",
});
export const runRuptureVelocityShearWaveRatioChecker =
  ruptureVelocityShearWaveRatioCheckerTool.execute;
export { ruptureVelocityShearWaveRatioCheckerExample as example };
export default ruptureVelocityShearWaveRatioCheckerTool;
