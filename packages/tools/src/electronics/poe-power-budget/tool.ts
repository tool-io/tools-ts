import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    sourcePowerW: 30,
    currentA: 0.6,
    loopResistanceOhm: 5,
    otherLossW: 1,
  },
  output: { cableLossW: 1.7999999999999998, deliveredPowerW: 27.2 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/poe-power-budget",
  title: "PoE Delivered Power Budget",
  description:
    "Estimate delivered PoE power as source power minus I²R cable loss and other fixed losses. Use the full loop resistance of the powered conductor pairs; protocol class and startup margins are not modeled.",
  inputs: [
    {
      id: "sourcePowerW",
      kind: "number",
      label: "Source power (W)",
      minimum: 0,
    },
    { id: "currentA", kind: "number", label: "Cable current (A)", minimum: 0 },
    {
      id: "loopResistanceOhm",
      kind: "number",
      label: "Loop resistance (Ω)",
      minimum: 0,
    },
    { id: "otherLossW", kind: "number", label: "Other loss (W)", minimum: 0 },
  ],
  outputs: [
    { id: "cableLossW", kind: "number", label: "Cable Loss W" },
    { id: "deliveredPowerW", kind: "number", label: "Delivered Power W" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      cableLossW: i.currentA * i.currentA * i.loopResistanceOhm,
      deliveredPowerW:
        i.sourcePowerW -
        i.currentA * i.currentA * i.loopResistanceOhm -
        i.otherLossW,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PoePowerBudgetInput = Readonly<typeof example.input>;
export type PoePowerBudgetOutput = Readonly<typeof example.output>;
export const poePowerBudgetTool = tool;
export const runPoePowerBudget = tool.execute;
export default tool;
