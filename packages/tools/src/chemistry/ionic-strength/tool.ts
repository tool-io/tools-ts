import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IonicStrengthInput = {
  readonly chargeA: number;
  readonly chargeB: number;
  readonly concentrationA: number;
  readonly concentrationB: number;
};

export type IonicStrengthOutput = {
  readonly ionicStrength: number;
};

export const ionicStrengthExample = {
  input: { chargeA: 2, chargeB: 1, concentrationA: 0.2, concentrationB: 0.1 },
  output: { ionicStrength: 0.45 },
} satisfies ToolExample<IonicStrengthInput, IonicStrengthOutput>;

export const ionicStrengthTool = createSimpleTool({
  id: "chemistry/ionic-strength",
  title: "Ionic Strength Calculator",
  description:
    "Compute ionic strength from the concentrations and charges of two ions.",
  inputs: [
    {
      id: "chargeA",
      kind: "integer",
      label: "Charge of ion A",
      maximum: 3,
      minimum: 1,
    },
    {
      id: "chargeB",
      kind: "integer",
      label: "Charge of ion B",
      maximum: 3,
      minimum: 1,
    },
    {
      id: "concentrationA",
      kind: "number",
      label: "Concentration of ion A",
      unit: "M",
    },
    {
      id: "concentrationB",
      kind: "number",
      label: "Concentration of ion B",
      unit: "M",
    },
  ],
  outputs: [
    { id: "ionicStrength", kind: "number", label: "Ionic strength", unit: "M" },
  ],
  calculate: (input) => {
    const chargeA = input.chargeA as number;
    const chargeB = input.chargeB as number;
    const concentrationA = input.concentrationA as number;
    const concentrationB = input.concentrationB as number;
    if (concentrationA < 0)
      simpleError(
        "concentrationA",
        "Concentration of ion A cannot be negative.",
      );
    if (concentrationB < 0)
      simpleError(
        "concentrationB",
        "Concentration of ion B cannot be negative.",
      );
    const chargeASquared = chargeA * chargeA;
    const chargeBSquared = chargeB * chargeB;
    return {
      ionicStrength:
        (concentrationA * chargeASquared + concentrationB * chargeBSquared) / 2,
    };
  },
});
export const runIonicStrength = ionicStrengthTool.execute;
export default ionicStrengthTool;
