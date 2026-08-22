import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const weightForceTool = createSimpleTool({
  id: "physics/weight-force",
  title: "Weight Force Calculator",
  description:
    "Compute weight force W = m·g using standard gravity, 9.80665 m/s².",
  inputs: [
    {
      description: "Mass in kilograms.",
      id: "massKg",
      label: "Mass",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Weight force in newtons.",
      id: "weightNewtons",
      label: "Weight force",
      kind: "number",
      unit: "N",
    },
  ],
  calculate: (input) => {
    return { weightNewtons: (input.massKg as number) * 9.80665 };
  },
});
export const runWeightForce = weightForceTool.execute;
export default weightForceTool;

export type WeightForceInput = {
  readonly massKg: number;
};

export type WeightForceOutput = {
  readonly weightNewtons: number;
};

export const weightForceExample = {
  input: {
    massKg: 1,
  },
  output: {
    weightNewtons: 9.80665,
  },
} satisfies ToolExample<WeightForceInput, WeightForceOutput>;
