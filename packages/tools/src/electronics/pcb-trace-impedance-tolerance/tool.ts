import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { nominalImpedanceOhm: 50, tolerancePercent: 10 },
  output: { minimumOhm: 45, maximumOhm: 55.00000000000001 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/pcb-trace-impedance-tolerance",
  title: "PCB Trace Impedance Tolerance",
  description:
    "Calculate the lower and upper impedance bounds from a nominal controlled-impedance value and a symmetric percentage tolerance. It does not calculate trace geometry or account for asymmetric fabrication variation.",
  inputs: [
    {
      id: "nominalImpedanceOhm",
      kind: "number",
      label: "Nominal impedance (Ω)",
      minimum: 0,
    },
    {
      id: "tolerancePercent",
      kind: "number",
      label: "Tolerance (%)",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "minimumOhm", kind: "number", label: "Minimum ohm" },
    { id: "maximumOhm", kind: "number", label: "Maximum ohm" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.tolerancePercent > 100)
      simpleError(
        "tolerancePercent",
        "Tolerance cannot exceed 100% for a nonnegative lower bound.",
      );
    const output = {
      minimumOhm: i.nominalImpedanceOhm * (1 - i.tolerancePercent / 100),
      maximumOhm: i.nominalImpedanceOhm * (1 + i.tolerancePercent / 100),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PcbTraceImpedanceToleranceInput = Readonly<typeof example.input>;
export type PcbTraceImpedanceToleranceOutput = Readonly<typeof example.output>;
export const pcbTraceImpedanceToleranceTool = tool;
export const runPcbTraceImpedanceTolerance = tool.execute;
export default tool;
