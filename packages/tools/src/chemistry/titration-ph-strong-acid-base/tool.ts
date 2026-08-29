import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const titrationPhStrongAcidBaseTool = createSimpleTool({
  id: "chemistry/titration-ph-strong-acid-base",
  title: "Titration pH Strong Acid Base Calculator",
  description:
    "Compute the pH after mixing strong acid and strong base moles from the excess hydronium or hydroxide in the total volume.",
  inputs: [
    {
      description: "Moles of strong acid (hydronium) added.",
      id: "acidMoles",
      label: "Acid moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Moles of strong base (hydroxide) added.",
      id: "baseMoles",
      label: "Base moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Combined solution volume; must be greater than zero.",
      id: "totalVolumeL",
      label: "Total volume",
      kind: "number",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Resulting solution pH.",
      id: "ph",
      label: "pH",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const volume = input.totalVolumeL as number;
    if (volume <= 0)
      simpleError(
        "totalVolumeL",
        "The total volume must be greater than zero.",
        "invalid_volume",
      );
    const excess = (input.acidMoles as number) - (input.baseMoles as number);
    if (excess === 0) return { ph: 7 };
    const concentration = Math.abs(excess) / volume;
    return excess > 0
      ? { ph: -Math.log10(concentration) }
      : { ph: 14 + Math.log10(concentration) };
  },
});
export const runTitrationPhStrongAcidBase =
  titrationPhStrongAcidBaseTool.execute;
export default titrationPhStrongAcidBaseTool;

export type TitrationPhStrongAcidBaseInput = {
  readonly acidMoles: number;
  readonly baseMoles: number;
  readonly totalVolumeL: number;
};

export type TitrationPhStrongAcidBaseOutput = {
  readonly ph: number;
};

export const titrationPhStrongAcidBaseExample = {
  input: {
    acidMoles: 1,
    baseMoles: 1,
    totalVolumeL: 1,
  },
  output: {
    ph: 7,
  },
} satisfies ToolExample<
  TitrationPhStrongAcidBaseInput,
  TitrationPhStrongAcidBaseOutput
>;
