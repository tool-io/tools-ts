import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const CollisionFrequencyTool = createSimpleTool({
  id: "chemistry/collision-frequency",
  title: "Collision Frequency Calculator",
  description: "Compute collision frequency z = sqrt(2)*pi*d^2*v_bar*n.",
  inputs: [
    {
      id: "meanSpeedMs",
      label: "Mean speed",
      kind: "number",
      minimum: 0,
      unit: "m/s",
    },
    {
      id: "collisionDiameterNM",
      label: "Collision diameter",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "numberDensityM3",
      label: "Number density",
      kind: "number",
      minimum: 0,
      unit: "1/m3",
    },
  ],
  outputs: [
    {
      id: "collisionFrequencyHz",
      label: "Collision frequency",
      kind: "number",
      unit: "1/s",
    },
  ],
  calculate: (input) => {
    const d = (input.collisionDiameterNM as number) * 1e-9;
    return {
      collisionFrequencyHz:
        Math.SQRT2 *
        Math.PI *
        d *
        d *
        (input.meanSpeedMs as number) *
        (input.numberDensityM3 as number),
    };
  },
});
export default CollisionFrequencyTool;
export const runCollisionFrequency = CollisionFrequencyTool.execute;

export type CollisionFrequencyInput = {
  readonly meanSpeedMs: number;
  readonly collisionDiameterNM: number;
  readonly numberDensityM3: number;
};

export type CollisionFrequencyOutput = {
  readonly collisionFrequencyHz: number;
};

export const collisionFrequencyExample = {
  input: {
    meanSpeedMs: 1,
    collisionDiameterNM: 1,
    numberDensityM3: 1,
  },
  output: {
    collisionFrequencyHz: 4.442882938158367e-18,
  },
} satisfies ToolExample<CollisionFrequencyInput, CollisionFrequencyOutput>;
