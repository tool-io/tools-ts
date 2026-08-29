import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const asperityAreaFractionScalingExample = {
  input: { seismicMomentNm: 1000000000000000000 },
  output: { asperityFraction: 1 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const asperityAreaFractionScalingTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ seismicMomentNm, scalingExponent }) => {
      const refM0 = 1e18;
      const exponent = scalingExponent ?? 0.25;
      if (!(seismicMomentNm > 0))
        simpleError("seismicMomentNm", "Seismic moment must be positive.");
      if (exponent < 0)
        simpleError("scalingExponent", "Scaling exponent cannot be negative.");
      return {
        asperityFraction: Math.min(
          1,
          Math.pow(seismicMomentNm / refM0, -exponent),
        ),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Asperity area fraction A_a/A₀ as a power-law function of seismic moment, capped at the physical upper bound of one.",
  id: "seismology/asperity-area-fraction-scaling",
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
      default: 0.25,
      description: "Scaling exponent.",
      id: "scalingExponent",
      kind: "number",
      label: "γ",
    },
  ],
  outputs: [
    {
      description: "Asperity area fraction.",
      id: "asperityFraction",
      kind: "number",
      label: "A_a/A₀",
    },
  ],
  title: "Asperity Area Fraction Scaling Calculator",
});
export const runAsperityAreaFractionScaling =
  asperityAreaFractionScalingTool.execute;
export { asperityAreaFractionScalingExample as example };
export default asperityAreaFractionScalingTool;
