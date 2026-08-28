import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const F_FARADAY = 96485.33212;

export const faradayMolesFromChargeExample = {
  input: { chargeCoulombs: 96485.33212 },
} satisfies ToolExample<{
  readonly chargeCoulombs: number;
}>;

export const faradayMolesFromChargeTool = createSimpleTool({
  id: "chemistry/faraday-moles-from-charge",
  title: "Moles Electrons From Charge",
  description:
    "Compute the moles of electrons as charge divided by the Faraday constant.",
  inputs: [
    { id: "chargeCoulombs", label: "Charge", kind: "number", unit: "C" },
  ],
  outputs: [
    {
      id: "molesOfElectrons",
      label: "Moles of electrons",
      kind: "number",
      unit: "mol",
    },
  ],
  calculate: (input) => {
    const chargeCoulombs = input.chargeCoulombs as number;
    if (chargeCoulombs < 0)
      simpleError("chargeCoulombs", "Charge cannot be negative.");
    return { molesOfElectrons: chargeCoulombs / F_FARADAY };
  },
});
export const runFaradayMolesFromCharge = faradayMolesFromChargeTool.execute;
export default faradayMolesFromChargeTool;
