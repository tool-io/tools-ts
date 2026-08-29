import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bruneCornerFrequencySourceModelExample = {
  input: {
    seismicMomentDynCm: 1e26,
    shearVelocityKmPerS: 3.5,
    stressDropBar: 30,
  },
  output: { cornerFrequencyHz: 0.11480775093909207 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const bruneCornerFrequencySourceModelTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ seismicMomentDynCm, shearVelocityKmPerS, stressDropBar }) => {
      if (!(shearVelocityKmPerS > 0))
        simpleError("shearVelocityKmPerS", "Shear velocity must be positive.");
      if (!(stressDropBar > 0))
        simpleError("stressDropBar", "Stress drop must be positive.");
      if (!(seismicMomentDynCm > 0))
        simpleError("seismicMomentDynCm", "Seismic moment must be positive.");
      return {
        cornerFrequencyHz:
          4.9e6 *
          shearVelocityKmPerS *
          Math.cbrt(stressDropBar / seismicMomentDynCm),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Compute the Brune (1970) circular-crack corner frequency fc = 4.9e6·β·(Δσ/M₀)^(1/3) with β in km/s, Δσ in bar, and M₀ in dyn·cm.",
  id: "seismology/brune-corner-frequency-source-model",
  inputs: [
    {
      default: 3.5,
      minimum: 0,
      description: "Shear-wave velocity at the source.",
      id: "shearVelocityKmPerS",
      kind: "number",
      label: "β",
      unit: "km/s",
    },
    {
      minimum: 0,
      description: "Stress drop Δσ in bar.",
      id: "stressDropBar",
      kind: "number",
      label: "Δσ",
      unit: "bar",
    },
    {
      minimum: 0,
      description: "Seismic moment M₀ in dyn·cm (1 N·m = 1e7 dyn·cm).",
      id: "seismicMomentDynCm",
      kind: "number",
      label: "M₀",
      unit: "dyn·cm",
    },
  ],
  outputs: [
    {
      description: "Corner frequency of the source spectrum.",
      id: "cornerFrequencyHz",
      kind: "number",
      label: "f_c",
      unit: "Hz",
    },
  ],
  title: "Brune Corner Frequency Source Model Calculator",
});
export const runBruneCornerFrequencySourceModel =
  bruneCornerFrequencySourceModelTool.execute;
export { bruneCornerFrequencySourceModelExample as example };
export default bruneCornerFrequencySourceModelTool;
