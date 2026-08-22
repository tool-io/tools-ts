import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CentripetalForceInput = {
  readonly massKg: number;
  readonly radiusM: number;
  readonly velocityMs: number;
};

export type CentripetalForceOutput = {
  readonly newtons: number;
};

export const centripetalForceExample = {
  input: { massKg: 2, velocityMs: 3, radiusM: 1.5 },
  output: { newtons: 12 },
} satisfies ToolExample<CentripetalForceInput, CentripetalForceOutput>;

export const centripetalForceTool = createSimpleTool({
  id: "physics/centripetal-force",
  title: "Centripetal Force Calculator",
  description:
    "Compute centripetal force as mass times squared speed divided by the circular path radius (F = m·v²/r).",
  inputs: [
    {
      description: "Mass of the orbiting body in kilograms.",
      id: "massKg",
      label: "Mass",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Speed along the circular path in metres per second.",
      id: "velocityMs",
      label: "Velocity",
      kind: "number",
      unit: "m/s",
    },
    {
      description: "Radius of the circular path in metres; must be positive.",
      id: "radiusM",
      label: "Radius",
      kind: "number",
      unit: "m",
    },
  ],
  outputs: [{ id: "newtons", label: "Force", kind: "number", unit: "N" }],
  calculate: (input) => {
    const radius = input.radiusM as number;
    if (radius <= 0)
      simpleError(
        "radiusM",
        "The radius must be greater than zero metres.",
        "invalid_radius",
      );
    const velocity = input.velocityMs as number;
    return {
      newtons: ((input.massKg as number) * velocity * velocity) / radius,
    };
  },
});
export const runCentripetalForce = centripetalForceTool.execute;
export default centripetalForceTool;
