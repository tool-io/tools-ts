import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const gasDensityStpExample = {
  input: { molarMassGPerMol: 32 },
} satisfies ToolExample<{
  readonly molarMassGPerMol: number;
}>;

export const gasDensityStpTool = createSimpleTool({
  id: "chemistry/gas-density-stp",
  title: "Gas Density STP",
  description:
    "Compute gas density at STP in g/L as molar mass divided by the molar volume of 22.414 liters per mole.",
  inputs: [
    {
      id: "molarMassGPerMol",
      label: "Molar mass",
      kind: "number",
      unit: "g/mol",
    },
  ],
  outputs: [
    { id: "densityGPL", label: "Density", kind: "number", unit: "g/L" },
  ],
  calculate: (input) => {
    const molarMassGPerMol = input.molarMassGPerMol as number;
    if (!(molarMassGPerMol > 0))
      simpleError("molarMassGPerMol", "Molar mass must be positive.");
    return { densityGPL: molarMassGPerMol / 22.414 };
  },
});
export const runGasDensityStp = gasDensityStpTool.execute;
export default gasDensityStpTool;
