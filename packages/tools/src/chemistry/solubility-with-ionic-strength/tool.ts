import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const solubilityWithIonicStrengthTool = createSimpleTool({
  id: "chemistry/solubility-with-ionic-strength",
  title: "Solubility With Ionic Strength Calculator",
  description:
    "Estimate molar solubility of a symmetric 1:1 electrolyte at 25 °C using s = s₀·10^(0.509·z²·√I), within the Debye-Hückel limiting-law range.",
  inputs: [
    {
      id: "intrinsicSolubilityMolL",
      label: "Intrinsic solubility",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
    },
    {
      id: "ionicStrengthMolL",
      label: "Ionic strength",
      kind: "number",
      maximum: 0.01,
      minimum: 0,
      unit: "mol/L",
    },
    {
      id: "ionChargeMagnitude",
      label: "Ion charge magnitude",
      kind: "integer",
      maximum: 3,
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "adjustedSolubilityMolL",
      label: "Adjusted solubility",
      kind: "number",
      unit: "mol/L",
    },
  ],
  calculate: (input) => {
    const charge = input.ionChargeMagnitude as number;
    const cf =
      10 **
      (0.509 * charge ** 2 * Math.sqrt(input.ionicStrengthMolL as number));
    return {
      adjustedSolubilityMolL: (input.intrinsicSolubilityMolL as number) * cf,
    };
  },
});
export const runSolubilityWithIonicStrength =
  solubilityWithIonicStrengthTool.execute;
export default solubilityWithIonicStrengthTool;

export type SolubilityWithIonicStrengthInput = {
  readonly intrinsicSolubilityMolL: number;
  readonly ionicStrengthMolL: number;
  readonly ionChargeMagnitude: number;
};

export type SolubilityWithIonicStrengthOutput = {
  readonly adjustedSolubilityMolL: number;
};

export const solubilityWithIonicStrengthExample = {
  input: {
    intrinsicSolubilityMolL: 1,
    ionicStrengthMolL: 0.01,
    ionChargeMagnitude: 1,
  },
  output: {
    adjustedSolubilityMolL: 1.124346053912487,
  },
} satisfies ToolExample<
  SolubilityWithIonicStrengthInput,
  SolubilityWithIonicStrengthOutput
>;
