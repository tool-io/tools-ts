import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const PROTON_MASS_DA = 1.007276;

export type MassSpecMzInput = {
  readonly chargeInt: number;
  readonly neutralMassDa: number;
};

export type MassSpecMzOutput = {
  readonly massToChargeRatio: number;
};

export const massSpecMzExample = {
  input: { neutralMassDa: 180, chargeInt: 2 },
  output: { massToChargeRatio: 91.007276 },
} satisfies ToolExample<MassSpecMzInput, MassSpecMzOutput>;

export const massSpecMzTool = createSimpleTool({
  id: "chemistry/mass-spec-mz",
  title: "Mass Spec m/z Calculator",
  description:
    "Compute the mass-to-charge ratio as the neutral mass plus charge times the proton mass divided by the charge.",
  inputs: [
    {
      id: "neutralMassDa",
      label: "Neutral mass",
      kind: "number",
      unit: "Da",
    },
    { id: "chargeInt", label: "Charge", kind: "integer", minimum: 1 },
  ],
  outputs: [
    {
      id: "massToChargeRatio",
      label: "Mass-to-charge ratio",
      kind: "number",
      unit: "m/z",
    },
  ],
  calculate: (input) => {
    const neutralMassDa = input.neutralMassDa as number;
    const chargeInt = input.chargeInt as number;
    if (!(neutralMassDa > 0))
      simpleError(
        "neutralMassDa",
        "Neutral mass must be positive.",
        "invalid_mass",
      );
    return {
      massToChargeRatio:
        (neutralMassDa + chargeInt * PROTON_MASS_DA) / chargeInt,
    };
  },
});
export const runMassSpecMz = massSpecMzTool.execute;
export default massSpecMzTool;
