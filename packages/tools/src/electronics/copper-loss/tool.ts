import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { currentA: 5, resistanceOhm: 0.2 },
  output: { lossW: 5 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/copper-loss",
  title: "Copper Loss",
  description:
    "Compute resistive winding or conductor loss as I²R from RMS current and resistance at the relevant operating temperature. Output is watts; AC skin and proximity effects are not included unless already reflected in the supplied resistance.",
  inputs: [
    { id: "currentA", kind: "number", label: "RMS current (A)", minimum: 0 },
    {
      id: "resistanceOhm",
      kind: "number",
      label: "Resistance (Ω)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "lossW", kind: "number", label: "Loss W" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { lossW: i.currentA * i.currentA * i.resistanceOhm };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type CopperLossInput = Readonly<typeof example.input>;
export type CopperLossOutput = Readonly<typeof example.output>;
export const copperLossTool = tool;
export const runCopperLoss = tool.execute;
export default tool;
