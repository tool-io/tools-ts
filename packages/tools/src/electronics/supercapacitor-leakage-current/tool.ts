import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { voltageV: 2.5, leakageResistanceOhm: 10000 },
  output: { leakageCurrentA: 0.00025 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/supercapacitor-leakage-current",
  title: "Supercapacitor Leakage Current",
  description:
    "Estimate steady leakage current from an equivalent parallel leakage resistance using I=V/R. Real supercapacitor leakage can depend on voltage, temperature, and settling time.",
  inputs: [
    { id: "voltageV", kind: "number", label: "Voltage (V)", minimum: 0 },
    {
      id: "leakageResistanceOhm",
      kind: "number",
      label: "Equivalent leakage resistance (Ω)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "leakageCurrentA", kind: "number", label: "Leakage Current A" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { leakageCurrentA: i.voltageV / i.leakageResistanceOhm };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type SupercapacitorLeakageCurrentInput = Readonly<typeof example.input>;
export type SupercapacitorLeakageCurrentOutput = Readonly<
  typeof example.output
>;
export const supercapacitorLeakageCurrentTool = tool;
export const runSupercapacitorLeakageCurrent = tool.execute;
export default tool;
