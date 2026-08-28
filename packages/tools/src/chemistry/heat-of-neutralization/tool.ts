import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const HeatOfNeutralizationTool = createSimpleTool({
  id: "chemistry/heat-of-neutralization",
  title: "Heat of Neutralization Calculator",
  description: "Compute heat of neutralization per mole water formed.",
  inputs: [
    {
      id: "heatReleasedJ",
      label: "q released",
      kind: "number",
      minimum: 0,
      unit: "J",
    },
    {
      id: "molesWater",
      label: "Moles water",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
  ],
  outputs: [
    {
      id: "neutralizationEnthalpyKJPerMol",
      label: "dH neutralization",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const mw = input.molesWater as number;
    if (mw <= 0) simpleError("molesWater", "> 0 required.", "invalid_moles");
    return {
      neutralizationEnthalpyKJPerMol:
        -(input.heatReleasedJ as number) / mw / 1000,
    };
  },
});
export default HeatOfNeutralizationTool;
export const runHeatOfNeutralization = HeatOfNeutralizationTool.execute;

export type HeatOfNeutralizationInput = {
  readonly heatReleasedJ: number;
  readonly molesWater: number;
};

export type HeatOfNeutralizationOutput = {
  readonly neutralizationEnthalpyKJPerMol: number;
};

export const heatOfNeutralizationExample = {
  input: {
    heatReleasedJ: 1,
    molesWater: 1,
  },
  output: {
    neutralizationEnthalpyKJPerMol: -0.001,
  },
} satisfies ToolExample<HeatOfNeutralizationInput, HeatOfNeutralizationOutput>;
