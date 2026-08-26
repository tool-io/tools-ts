import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MembraneCapacitanceSpecificInput = {
  readonly capacitanceMicrofarads: number;
  readonly membraneAreaCm2: number;
};

export type MembraneCapacitanceSpecificOutput = {
  readonly specificCapacitanceUfPerCm2: number;
};

export const membraneCapacitanceSpecificExample = {
  input: { capacitanceMicrofarads: 0.0001, membraneAreaCm2: 0.0001 },
  output: { specificCapacitanceUfPerCm2: 1 },
} satisfies ToolExample<
  MembraneCapacitanceSpecificInput,
  MembraneCapacitanceSpecificOutput
>;

export const membraneCapacitanceSpecificTool = createSimpleTool({
  id: "biology/membrane-capacitance-specific",
  title: "Specific Membrane Capacitance",
  description:
    "Compute specific membrane capacitance in microfarads per square centimetre as total membrane capacitance divided by membrane area.",
  inputs: [
    {
      id: "capacitanceMicrofarads",
      kind: "number",
      label: "Membrane capacitance",
      unit: "µF",
    },
    {
      id: "membraneAreaCm2",
      kind: "number",
      label: "Membrane area",
      unit: "cm²",
    },
  ],
  outputs: [
    {
      id: "specificCapacitanceUfPerCm2",
      kind: "number",
      label: "Specific membrane capacitance",
      unit: "µF/cm²",
    },
  ],
  calculate: (input) => {
    const capacitanceMicrofarads = input.capacitanceMicrofarads as number;
    const membraneAreaCm2 = input.membraneAreaCm2 as number;
    if (!(capacitanceMicrofarads > 0))
      simpleError(
        "capacitanceMicrofarads",
        "The membrane capacitance must be greater than zero.",
      );
    if (!(membraneAreaCm2 > 0))
      simpleError(
        "membraneAreaCm2",
        "The membrane area must be greater than zero.",
      );
    return {
      specificCapacitanceUfPerCm2: capacitanceMicrofarads / membraneAreaCm2,
    };
  },
});
export const runMembraneCapacitanceSpecific =
  membraneCapacitanceSpecificTool.execute;
export default membraneCapacitanceSpecificTool;
