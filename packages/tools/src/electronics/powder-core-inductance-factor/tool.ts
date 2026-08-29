import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { inductanceFactorNhPerTurn2: 100, turns: 20 },
  output: { inductanceNh: 40000 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/powder-core-inductance-factor",
  title: "Powder Core AL Inductance",
  description:
    "Calculate inductance L=AL·N² from a core's inductance factor and turn count. AL and output use the same unit per turn squared; account for DC bias separately because effective permeability can fall.",
  inputs: [
    {
      id: "inductanceFactorNhPerTurn2",
      kind: "number",
      label: "AL (nH/turn²)",
      minimum: 0,
    },
    { id: "turns", kind: "integer", label: "Turns", minimum: 0 },
  ],
  outputs: [{ id: "inductanceNh", kind: "number", label: "Inductance Nh" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      inductanceNh: i.inductanceFactorNhPerTurn2 * i.turns * i.turns,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PowderCoreInductanceFactorInput = Readonly<typeof example.input>;
export type PowderCoreInductanceFactorOutput = Readonly<typeof example.output>;
export const powderCoreInductanceFactorTool = tool;
export const runPowderCoreInductanceFactor = tool.execute;
export default tool;
