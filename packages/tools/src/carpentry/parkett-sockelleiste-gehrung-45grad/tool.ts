import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SkirtingMiterAngleInput = {
  readonly cornerAngleDeg?: number;
};

export type SkirtingMiterAngleOutput = {
  readonly miterAngleDeg: number;
};

export const skirtingMiterAngleExample = {
  input: { cornerAngleDeg: 90 },
  output: { miterAngleDeg: 45 },
} satisfies ToolExample<SkirtingMiterAngleInput, SkirtingMiterAngleOutput>;

export const skirtingMiterAngleTool = createSimpleTool({
  id: "carpentry/parkett-sockelleiste-gehrung-45grad",
  title: "Skirting Miter Angle Calculator",
  description:
    "Compute the skirting board miter angle from the wall corner angle.",
  inputs: [
    {
      default: 90,
      description: "Inside corner angle between the walls in degrees.",
      id: "cornerAngleDeg",
      kind: "number",
      label: "Corner angle",
      maximum: 180,
      minimum: 60,
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Miter saw setting per skirting end in degrees.",
      id: "miterAngleDeg",
      kind: "number",
      label: "Miter angle",
      unit: "°",
    },
  ],
  calculate: (input) => {
    const cornerAngleDeg = input.cornerAngleDeg as number;
    return { miterAngleDeg: (180 - cornerAngleDeg) / 2 };
  },
});
export const runSkirtingMiterAngle = skirtingMiterAngleTool.execute;
export default skirtingMiterAngleTool;
