import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const rayParameterSlownessApparentVelocityExample = {
  input: { slownessSPerDeg: 6 },
  output: {
    apparentVelocityKmS: 18.5325,
    rayParameterSPerRad: 343.77467707849394,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const rayParameterSlownessApparentVelocityTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ slownessSPerDeg }) => {
      if (slownessSPerDeg <= 0)
        simpleError("slownessSPerDeg", "Slowness must be positive.");
      return {
        apparentVelocityKmS: 111.195 / slownessSPerDeg,
        rayParameterSPerRad: slownessSPerDeg / (Math.PI / 180),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Convert horizontal slowness (s/deg) to apparent velocity using 111.195 km/deg.",
  id: "seismology/ray-parameter-slowness-apparent-velocity",
  inputs: [
    {
      minimum: 0,
      description: "Horizontal slowness.",
      id: "slownessSPerDeg",
      kind: "number",
      label: "p",
      unit: "s/°",
    },
  ],
  outputs: [
    {
      description: "Apparent velocity across the array.",
      id: "apparentVelocityKmS",
      kind: "number",
      label: "v_app",
      unit: "km/s",
    },
    {
      description: "Slowness in s/radian.",
      id: "rayParameterSPerRad",
      kind: "number",
      label: "p_rad",
      unit: "s/rad",
    },
  ],
  title: "Ray Parameter Slowness Apparent Velocity Converter",
});
export const runRayParameterSlownessApparentVelocity =
  rayParameterSlownessApparentVelocityTool.execute;
export { rayParameterSlownessApparentVelocityExample as example };
export default rayParameterSlownessApparentVelocityTool;
