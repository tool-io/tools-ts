import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const waterIonProductTool = createSimpleTool({
  id: "chemistry/water-ion-product",
  title: "Water Ion Product Calculator",
  description:
    "Compute the ion product Kw = [H⁺]·[OH⁻] from measured hydronium and hydroxide concentrations.",
  inputs: [
    {
      description: "Hydronium concentration in mol/L.",
      id: "hConcentrationMolL",
      label: "[H⁺]",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      description: "Hydroxide concentration in mol/L.",
      id: "ohConcentrationMolL",
      label: "[OH⁻]",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
  ],
  outputs: [
    {
      description: "Ion product of water.",
      id: "kw",
      label: "Kw",
      kind: "number",
    },
  ],
  calculate: (input) => {
    return {
      kw:
        (input.hConcentrationMolL as number) *
        (input.ohConcentrationMolL as number),
    };
  },
});
export const runWaterIonProduct = waterIonProductTool.execute;
export default waterIonProductTool;

export type WaterIonProductInput = {
  readonly hConcentrationMolL: number;
  readonly ohConcentrationMolL: number;
};

export type WaterIonProductOutput = {
  readonly kw: number;
};

export const waterIonProductExample = {
  input: {
    hConcentrationMolL: 1,
    ohConcentrationMolL: 1,
  },
  output: {
    kw: 1,
  },
} satisfies ToolExample<WaterIonProductInput, WaterIonProductOutput>;
