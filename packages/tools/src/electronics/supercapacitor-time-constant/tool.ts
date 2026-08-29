import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { resistanceOhm: 2, capacitanceF: 100 },
  output: { timeConstantS: 200 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/supercapacitor-time-constant",
  title: "Supercapacitor RC Time Constant",
  description:
    "Calculate τ=RC for a supercapacitor and a series or load resistance. This ideal first-order time constant does not model voltage-dependent capacitance or leakage.",
  inputs: [
    {
      id: "resistanceOhm",
      kind: "number",
      label: "Resistance (Ω)",
      minimum: 0,
    },
    {
      id: "capacitanceF",
      kind: "number",
      label: "Capacitance (F)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "timeConstantS", kind: "number", label: "Time Constant S" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { timeConstantS: i.resistanceOhm * i.capacitanceF };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type SupercapacitorTimeConstantInput = Readonly<typeof example.input>;
export type SupercapacitorTimeConstantOutput = Readonly<typeof example.output>;
export const supercapacitorTimeConstantTool = tool;
export const runSupercapacitorTimeConstant = tool.execute;
export default tool;
