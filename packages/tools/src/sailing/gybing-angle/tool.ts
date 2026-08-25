import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GybingAngleInput = {
  readonly broadReachingAngleDeg: number;
};

export type GybingAngleOutput = {
  readonly gybingAngle: number;
};

export const gybingAngleExample = {
  input: { broadReachingAngleDeg: 75 },
  output: { gybingAngle: 150 },
} satisfies ToolExample<GybingAngleInput, GybingAngleOutput>;

export const gybingAngleTool = createSimpleTool({
  calculate: (input) => ({
    gybingAngle: 2 * (input.broadReachingAngleDeg as number),
  }),
  description:
    "Calculate the course change through a gybe as twice the sailing angle away from dead downwind.",
  id: "sailing/gybing-angle",
  inputs: [
    {
      description:
        "Course angle away from dead downwind, between 10 and 85 degrees.",
      id: "broadReachingAngleDeg",
      kind: "number",
      label: "Broad reaching angle",
      maximum: 85,
      minimum: 10,
      unit: "deg",
    },
  ],
  outputs: [
    {
      description: "Total angle between the two gybes.",
      id: "gybingAngle",
      kind: "number",
      label: "Gybing angle",
      unit: "deg",
    },
  ],
  title: "Gybing Angle Calculator",
});
export const runGybingAngle = gybingAngleTool.execute;
export default gybingAngleTool;
