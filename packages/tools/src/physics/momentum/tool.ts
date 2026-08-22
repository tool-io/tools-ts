import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const momentumTool = createSimpleTool({
  id: "physics/momentum",
  title: "Momentum Calculator",
  description: "Compute linear momentum as mass times velocity (p = m·v).",
  inputs: [
    {
      description: "Mass in kilograms.",
      id: "massKg",
      label: "Mass",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
    {
      description:
        "Velocity in meters per second; negative means opposite direction.",
      id: "velocityMs",
      label: "Velocity",
      kind: "number",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Momentum in kilogram meters per second.",
      id: "momentumKgMs",
      label: "Momentum",
      kind: "number",
      unit: "kg·m/s",
    },
  ],
  calculate: (input) => {
    return {
      momentumKgMs: (input.massKg as number) * (input.velocityMs as number),
    };
  },
});
export const runMomentum = momentumTool.execute;
export default momentumTool;

export type MomentumInput = {
  readonly massKg: number;
  readonly velocityMs: number;
};

export type MomentumOutput = {
  readonly momentumKgMs: number;
};

export const momentumExample = {
  input: {
    massKg: 1,
    velocityMs: 1,
  },
  output: {
    momentumKgMs: 1,
  },
} satisfies ToolExample<MomentumInput, MomentumOutput>;
