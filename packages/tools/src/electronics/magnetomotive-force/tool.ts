import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { turns: 100, currentA: 2 },
  output: { magnetomotiveForceAmpereTurns: 200 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/magnetomotive-force",
  title: "Magnetomotive Force",
  description:
    "Calculate magnetomotive force as winding turns × current in ampere-turns. The current sign determines field direction under the selected winding convention.",
  inputs: [
    { id: "turns", kind: "integer", label: "Turns", minimum: 0 },
    { id: "currentA", kind: "number", label: "Current (A)" },
  ],
  outputs: [
    {
      id: "magnetomotiveForceAmpereTurns",
      kind: "number",
      label: "Magnetomotive Force Ampere Turns",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { magnetomotiveForceAmpereTurns: i.turns * i.currentA };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type MagnetomotiveForceInput = Readonly<typeof example.input>;
export type MagnetomotiveForceOutput = Readonly<typeof example.output>;
export const magnetomotiveForceTool = tool;
export const runMagnetomotiveForce = tool.execute;
export default tool;
