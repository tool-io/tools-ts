import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const F_FARADAY = 96485.33212;

export const faradayChargeFromMolesExample = {
  input: { molesElectrons: 2 },
} satisfies ToolExample<{
  readonly molesElectrons: number;
}>;

export const faradayChargeFromMolesTool = createSimpleTool({
  id: "chemistry/faraday-charge-from-moles",
  title: "Charge From Moles Electrons",
  description:
    "Compute the total charge as moles of electrons times the Faraday constant.",
  inputs: [
    {
      id: "molesElectrons",
      label: "Moles of electrons",
      kind: "number",
      unit: "mol",
    },
  ],
  outputs: [
    { id: "chargeCoulombs", label: "Charge", kind: "number", unit: "C" },
  ],
  calculate: (input) => {
    const molesElectrons = input.molesElectrons as number;
    if (molesElectrons < 0)
      simpleError("molesElectrons", "Moles of electrons cannot be negative.");
    return { chargeCoulombs: molesElectrons * F_FARADAY };
  },
});
export const runFaradayChargeFromMoles = faradayChargeFromMolesTool.execute;
export default faradayChargeFromMolesTool;
