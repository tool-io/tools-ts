import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bohrEffectOxygenExample = {
  input: { ph1: 7.4, ph2: 6.8 },
  output: { p50ShiftLogUnits: 0.28800000000000026 },
} satisfies ToolExample<
  {
    readonly ph1: number;
    readonly ph2: number;
    readonly phiBohrCoefficient?: number;
  },
  { readonly p50ShiftLogUnits: number }
>;

export const bohrEffectOxygenTool = createSimpleTool({
  id: "biology/bohr-effect-oxygen",
  title: "Bohr Effect Shift",
  description:
    "Compute the Bohr effect shift of hemoglobin oxygen affinity as shiftLogP50 = phiBohrCoefficient x (pH2 - pH1), where phi is the signed Bohr coefficient, negative by convention and defaulting to -0.48 for human whole blood.",
  inputs: [
    {
      description: "Initial pH between 6 and 8.5.",
      id: "ph1",
      label: "Initial pH",
      kind: "number",
      maximum: 8.5,
      minimum: 6,
    },
    {
      description: "Final pH between 6 and 8.5.",
      id: "ph2",
      label: "Final pH",
      kind: "number",
      maximum: 8.5,
      minimum: 6,
    },
    {
      default: -0.48,
      description:
        "Signed Bohr coefficient d(log P50)/d(pH); defaults to -0.48.",
      id: "phiBohrCoefficient",
      label: "Bohr coefficient",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Shift of log10(P50) in log units.",
      id: "p50ShiftLogUnits",
      label: "P50 shift",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const ph1 = input.ph1 as number;
    const ph2 = input.ph2 as number;
    const phi = input.phiBohrCoefficient as number;
    return { p50ShiftLogUnits: phi * (ph2 - ph1) };
  },
});
export const runBohrEffectOxygen = bohrEffectOxygenTool.execute;
export default bohrEffectOxygenTool;
