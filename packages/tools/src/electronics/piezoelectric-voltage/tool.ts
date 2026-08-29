import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { chargeC: 2e-8, capacitanceF: 1e-9 },
  output: { voltageV: 20 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/piezoelectric-voltage",
  title: "Piezoelectric Open-Circuit Voltage",
  description:
    "Estimate open-circuit piezoelectric voltage as generated charge divided by effective capacitance. Loading, leakage, and amplifier input impedance can reduce measured voltage.",
  inputs: [
    { id: "chargeC", kind: "number", label: "Generated charge (C)" },
    {
      id: "capacitanceF",
      kind: "number",
      label: "Effective capacitance (F)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "voltageV", kind: "number", label: "Voltage V" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { voltageV: i.chargeC / i.capacitanceF };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PiezoelectricVoltageInput = Readonly<typeof example.input>;
export type PiezoelectricVoltageOutput = Readonly<typeof example.output>;
export const piezoelectricVoltageTool = tool;
export const runPiezoelectricVoltage = tool.execute;
export default tool;
