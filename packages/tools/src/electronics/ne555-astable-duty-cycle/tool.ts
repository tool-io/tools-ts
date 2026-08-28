import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ne555AstableDutyCycleExample = {
  input: { r1Ohms: 1000, r2Ohms: 2000 },
  output: { dutyCyclePercent: 60 },
} satisfies ToolExample<
  { readonly r1Ohms: number; readonly r2Ohms: number },
  { readonly dutyCyclePercent: number }
>;

export const ne555AstableDutyCycleTool = createSimpleTool({
  calculate: (input) => {
    const r1 = input.r1Ohms as number;
    const r2 = input.r2Ohms as number;
    if (!(r1 + 2 * r2 > 0))
      simpleError(
        "r1Ohms",
        "Resistances must give a positive period.",
        "invalid_resistance",
      );
    return { dutyCyclePercent: ((r1 + r2) / (r1 + 2 * r2)) * 100 };
  },
  description:
    "Compute the output duty cycle percentage of an NE555 astable circuit from R1 and R2.",
  id: "electronics/ne555-astable-duty-cycle",
  inputs: [
    { id: "r1Ohms", kind: "number", label: "R1", unit: "Ω" },
    { id: "r2Ohms", kind: "number", label: "R2", unit: "Ω" },
  ],
  outputs: [
    {
      id: "dutyCyclePercent",
      kind: "number",
      label: "Duty cycle",
      unit: "%",
    },
  ],
  title: "NE555 Duty Cycle",
});
export const runNe555AstableDutyCycle = ne555AstableDutyCycleTool.execute;
export default ne555AstableDutyCycleTool;
