import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type VaporPressureLoweringInput = {
  readonly moleFractionSolute: number;
};

export type VaporPressureLoweringOutput = {
  readonly vaporPressureLoweringPercent: number;
};

export const vaporPressureLoweringExample = {
  input: { moleFractionSolute: 0.25 },
  output: { vaporPressureLoweringPercent: 25 },
} satisfies ToolExample<
  VaporPressureLoweringInput,
  VaporPressureLoweringOutput
>;

export const vaporPressureLoweringTool = createSimpleTool({
  id: "chemistry/vapor-pressure-lowering",
  title: "Vapor Pressure Lowering",
  description:
    "Estimate relative vapor pressure lowering from the solute mole fraction.",
  inputs: [
    {
      id: "moleFractionSolute",
      kind: "number",
      label: "Solute mole fraction",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "vaporPressureLoweringPercent",
      kind: "number",
      label: "Vapor pressure lowering",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const moleFractionSolute = input.moleFractionSolute as number;
    return { vaporPressureLoweringPercent: moleFractionSolute * 100 };
  },
});
export const runVaporPressureLowering = vaporPressureLoweringTool.execute;
export default vaporPressureLoweringTool;
