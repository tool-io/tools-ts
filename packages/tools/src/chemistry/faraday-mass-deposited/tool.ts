import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const F_FARADAY = 96485.33212;

export const faradayMassDepositedExample = {
  input: {
    chargeCoulombs: 96485.33212,
    electronCount: 2,
    molarMassGPerMol: 63.55,
  },
} satisfies ToolExample<{
  readonly chargeCoulombs: number;
  readonly electronCount: number;
  readonly molarMassGPerMol: number;
}>;

export const faradayMassDepositedTool = createSimpleTool({
  id: "chemistry/faraday-mass-deposited",
  title: "Faraday Mass Deposited",
  description:
    "Compute the mass deposited in electrolysis as charge times molar mass divided by electron count times the Faraday constant.",
  inputs: [
    { id: "chargeCoulombs", label: "Charge", kind: "number", unit: "C" },
    {
      id: "molarMassGPerMol",
      label: "Molar mass",
      kind: "number",
      unit: "g/mol",
    },
    {
      id: "electronCount",
      label: "Electrons transferred",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "depositedMassGrams",
      label: "Deposited mass",
      kind: "number",
      unit: "g",
    },
  ],
  calculate: (input) => {
    const chargeCoulombs = input.chargeCoulombs as number;
    const molarMassGPerMol = input.molarMassGPerMol as number;
    if (chargeCoulombs < 0)
      simpleError("chargeCoulombs", "Charge cannot be negative.");
    if (!(molarMassGPerMol > 0))
      simpleError("molarMassGPerMol", "Molar mass must be positive.");
    return {
      depositedMassGrams:
        (chargeCoulombs * molarMassGPerMol) /
        ((input.electronCount as number) * F_FARADAY),
    };
  },
});
export const runFaradayMassDeposited = faradayMassDepositedTool.execute;
export default faradayMassDepositedTool;
