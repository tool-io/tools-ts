import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pcrYieldExample = {
  input: { startingCopies: 10, cycles: 10 },
} satisfies ToolExample<{
  readonly cycles: number;
  readonly startingCopies: number;
}>;

export const pcrYieldTool = createSimpleTool({
  id: "biology/pcr-yield",
  title: "PCR Yield Estimate",
  description:
    "Estimate PCR product yield by compounding the starting copy count once per cycle with an efficiency factor.",
  inputs: [
    { id: "startingCopies", label: "Starting copies", kind: "number" },
    { id: "cycles", label: "Cycles", kind: "integer", maximum: 60, minimum: 1 },
    {
      default: 2,
      id: "efficiencyFactor",
      label: "Efficiency factor",
      kind: "number",
      maximum: 2,
      minimum: 1,
    },
  ],
  outputs: [
    { id: "finalCopyCount", label: "Final copy count", kind: "number" },
  ],
  calculate: (input) => {
    const startingCopies = input.startingCopies as number;
    const cycles = input.cycles as number;
    const efficiencyFactor = input.efficiencyFactor as number;
    if (startingCopies <= 0)
      simpleError(
        "startingCopies",
        "Starting copies must be greater than zero.",
        "invalid_value",
      );
    return {
      finalCopyCount: startingCopies * Math.pow(efficiencyFactor, cycles),
    };
  },
});
export const runPcrYield = pcrYieldTool.execute;
export default pcrYieldTool;
