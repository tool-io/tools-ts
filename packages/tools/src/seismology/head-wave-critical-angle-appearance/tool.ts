import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const headWaveCriticalAngleAppearanceExample = {
  input: { upperVelocityMS: 1500, lowerVelocityMS: 3000 },
  output: {
    criticalAngleDeg: (Math.asin(0.5) * 180) / Math.PI,
    headWavePossible: true,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const headWaveCriticalAngleAppearanceTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ upperVelocityMS, lowerVelocityMS }) => {
      if (upperVelocityMS <= 0)
        simpleError("upperVelocityMS", "Upper velocity must be positive.");
      if (lowerVelocityMS <= 0)
        simpleError("lowerVelocityMS", "Lower velocity must be positive.");
      if (upperVelocityMS >= lowerVelocityMS)
        simpleError(
          "upperVelocityMS",
          "Head waves need a faster lower medium (V₁ < V₂).",
        );
      return {
        criticalAngleDeg:
          (Math.asin(upperVelocityMS / lowerVelocityMS) * 180) / Math.PI,
        headWavePossible: true,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Critical angle i_c = arcsin(V₁/V₂); no head wave exists when V₁ ≥ V₂.",
  id: "seismology/head-wave-critical-angle-appearance",
  inputs: [
    {
      minimum: 0,
      description: "Upper medium velocity.",
      id: "upperVelocityMS",
      kind: "number",
      label: "V₁",
      unit: "m/s",
    },
    {
      minimum: 0,
      description: "Lower medium velocity.",
      id: "lowerVelocityMS",
      kind: "number",
      label: "V₂",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Critical angle from vertical.",
      id: "criticalAngleDeg",
      kind: "number",
      label: "i_c",
      unit: "°",
    },
    {
      description: "Whether a head wave can be generated.",
      id: "headWavePossible",
      kind: "boolean",
      label: "Possible",
    },
  ],
  title: "Head Wave Critical Angle Appearance Calculator",
});
export const runHeadWaveCriticalAngleAppearance =
  headWaveCriticalAngleAppearanceTool.execute;
export { headWaveCriticalAngleAppearanceExample as example };
export default headWaveCriticalAngleAppearanceTool;
