import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type WorkInput = {
  readonly angleDegrees: number;
  readonly distanceM: number;
  readonly forceN: number;
};

export type WorkOutput = {
  readonly workJoules: number;
};

export const workExample = {
  input: { forceN: 10, distanceM: 5, angleDegrees: 0 },
  output: { workJoules: 50 },
} satisfies ToolExample<WorkInput, WorkOutput>;

export const workTool = createSimpleTool({
  id: "physics/work",
  title: "Work Calculator",
  description:
    "Compute mechanical work as force times displacement times the cosine of the angle between them (W = F·d·cos θ).",
  inputs: [
    {
      description: "Magnitude of the applied force in newtons.",
      id: "forceN",
      label: "Force",
      kind: "number",
      unit: "N",
    },
    {
      description: "Displacement along the direction of travel in metres.",
      id: "distanceM",
      label: "Distance",
      kind: "number",
      unit: "m",
    },
    {
      default: 0,
      description: "Angle between the force and the displacement in degrees.",
      id: "angleDegrees",
      label: "Angle",
      kind: "number",
      unit: "°",
    },
  ],
  outputs: [{ id: "workJoules", label: "Work", kind: "number", unit: "J" }],
  calculate: (input) => {
    return {
      workJoules:
        (input.forceN as number) *
        (input.distanceM as number) *
        Math.cos(((input.angleDegrees as number) * Math.PI) / 180),
    };
  },
});
export const runWork = workTool.execute;
export default workTool;
