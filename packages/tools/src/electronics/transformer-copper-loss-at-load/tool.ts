import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    primaryCurrentA: 1,
    primaryResistanceOhm: 2,
    secondaryCurrentA: 5,
    secondaryResistanceOhm: 0.1,
  },
  output: { primaryLossW: 2, secondaryLossW: 2.5, totalCopperLossW: 4.5 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/transformer-copper-loss-at-load",
  title: "Transformer Copper Loss at Load",
  description:
    "Sum primary and secondary winding I²R losses using RMS currents and operating-temperature resistances. Additional windings and AC resistance effects are not included.",
  inputs: [
    {
      id: "primaryCurrentA",
      kind: "number",
      label: "Primary RMS current (A)",
      minimum: 0,
    },
    {
      id: "primaryResistanceOhm",
      kind: "number",
      label: "Primary resistance (Ω)",
      minimum: 0,
    },
    {
      id: "secondaryCurrentA",
      kind: "number",
      label: "Secondary RMS current (A)",
      minimum: 0,
    },
    {
      id: "secondaryResistanceOhm",
      kind: "number",
      label: "Secondary resistance (Ω)",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "primaryLossW", kind: "number", label: "Primary Loss W" },
    { id: "secondaryLossW", kind: "number", label: "Secondary Loss W" },
    { id: "totalCopperLossW", kind: "number", label: "Total Copper Loss W" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      primaryLossW:
        i.primaryCurrentA * i.primaryCurrentA * i.primaryResistanceOhm,
      secondaryLossW:
        i.secondaryCurrentA * i.secondaryCurrentA * i.secondaryResistanceOhm,
      totalCopperLossW:
        i.primaryCurrentA * i.primaryCurrentA * i.primaryResistanceOhm +
        i.secondaryCurrentA * i.secondaryCurrentA * i.secondaryResistanceOhm,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type TransformerCopperLossAtLoadInput = Readonly<typeof example.input>;
export type TransformerCopperLossAtLoadOutput = Readonly<typeof example.output>;
export const transformerCopperLossAtLoadTool = tool;
export const runTransformerCopperLossAtLoad = tool.execute;
export default tool;
