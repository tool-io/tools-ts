import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const forceTool = createSimpleTool({
  id: "physics/force",
  title: "Force Calculator",
  description: "Compute force as mass times acceleration (F = m·a).",
  inputs: [
    {
      description: "Mass in kilograms.",
      id: "massKg",
      label: "Mass",
      kind: "number",
      unit: "kg",
    },
    {
      description: "Acceleration in meters per second squared.",
      id: "accelerationMs2",
      label: "Acceleration",
      kind: "number",
      unit: "m/s²",
    },
  ],
  outputs: [{ id: "newtons", label: "Force", kind: "number", unit: "N" }],
  calculate: (input) => {
    return {
      newtons: (input.massKg as number) * (input.accelerationMs2 as number),
    };
  },
});
export const runForce = forceTool.execute;
export default forceTool;

export type ForceInput = {
  readonly massKg: number;
  readonly accelerationMs2: number;
};

export type ForceOutput = {
  readonly newtons: number;
};

export const forceExample = {
  input: {
    massKg: 1,
    accelerationMs2: 1,
  },
  output: {
    newtons: 1,
  },
} satisfies ToolExample<ForceInput, ForceOutput>;
