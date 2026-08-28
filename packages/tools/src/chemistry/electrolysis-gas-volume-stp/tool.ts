import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const electrolysisGasVolumeStpExample = {
  input: { molesGas: 2 },
} satisfies ToolExample<{
  readonly molesGas: number;
}>;

export const electrolysisGasVolumeStpTool = createSimpleTool({
  id: "chemistry/electrolysis-gas-volume-stp",
  title: "Electrolysis Gas Volume STP",
  description:
    "Compute the gas volume at STP as moles of gas times 22.414 liters per mole.",
  inputs: [
    { id: "molesGas", label: "Moles of gas", kind: "number", unit: "mol" },
  ],
  outputs: [
    {
      id: "gasVolumeLiters",
      label: "Gas volume at STP",
      kind: "number",
      unit: "L",
    },
  ],
  calculate: (input) => {
    const molesGas = input.molesGas as number;
    if (molesGas < 0)
      simpleError("molesGas", "Moles of gas cannot be negative.");
    return { gasVolumeLiters: molesGas * 22.414 };
  },
});
export const runElectrolysisGasVolumeStp = electrolysisGasVolumeStpTool.execute;
export default electrolysisGasVolumeStpTool;
