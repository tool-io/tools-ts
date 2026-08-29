import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const vs30TimeAveragedShearVelocityExample = {
  input: { thicknessesM: [5, 10, 15], shearVelocitiesMS: [200, 400, 800] },
  output: { vs30MS: 436.3636363636363, profileDepthM: 30 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const vs30TimeAveragedShearVelocityTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    ((raw: Record<string, unknown>) => {
      const rawThicknesses = raw.thicknessesM as unknown;
      const rawVelocities = raw.shearVelocitiesMS as unknown;
      if (
        !Array.isArray(rawThicknesses) ||
        !Array.isArray(rawVelocities) ||
        rawThicknesses.length !== rawVelocities.length ||
        rawThicknesses.length === 0
      )
        simpleError(
          "thicknessesM",
          "Provide equal-length, non-empty layer lists.",
        );
      const thicknessesM = rawThicknesses as number[];
      const shearVelocitiesMS = rawVelocities as number[];
      let travelTime = 0;
      let depth = 0;
      for (let i = 0; i < thicknessesM.length; i++) {
        if (depth >= 30) break;
        if (thicknessesM[i] <= 0)
          simpleError(
            "thicknessesM",
            "All layer thicknesses must be positive.",
          );
        if (shearVelocitiesMS[i] <= 0)
          simpleError("shearVelocitiesMS", "All Vs values must be positive.");
        const usedM = Math.min(thicknessesM[i], 30 - depth);
        travelTime += usedM / shearVelocitiesMS[i];
        depth += usedM;
      }
      if (depth < 30)
        simpleError("thicknessesM", "Profile must reach at least 30 m depth.");
      return { vs30MS: 30 / travelTime, profileDepthM: depth };
    })(input as never) as Record<string, unknown>,
  description:
    "Time-averaged shear velocity over the top 30 m: VS30 = 30 / Σ(dᵢ/Vsᵢ).",
  id: "seismology/vs30-time-averaged-shear-velocity",
  inputs: [
    {
      description: "Layer thicknesses (m), top-down.",
      id: "thicknessesM",
      kind: "numberList",
      label: "dᵢ",
    },
    {
      description: "Layer shear velocities (m/s), top-down.",
      id: "shearVelocitiesMS",
      kind: "numberList",
      label: "Vsᵢ",
    },
  ],
  outputs: [
    {
      description: "Time-averaged shear velocity to 30 m.",
      id: "vs30MS",
      kind: "number",
      label: "VS30",
      unit: "m/s",
    },
    {
      description: "Profile depth used for the average (truncated at 30 m).",
      id: "profileDepthM",
      kind: "number",
      label: "Depth",
      unit: "m",
    },
  ],
  title: "VS30 Time Averaged Shear Velocity Calculator",
});
export const runVs30TimeAveragedShearVelocity =
  vs30TimeAveragedShearVelocityTool.execute;
export { vs30TimeAveragedShearVelocityExample as example };
export default vs30TimeAveragedShearVelocityTool;
