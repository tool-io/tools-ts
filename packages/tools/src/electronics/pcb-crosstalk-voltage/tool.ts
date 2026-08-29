import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    aggressorStepV: 3.3,
    couplingCapacitancePf: 1,
    victimCapacitancePf: 9,
  },
  output: { victimStepV: 0.32999999999999996 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/pcb-crosstalk-voltage",
  title: "Capacitive PCB Crosstalk Voltage",
  description:
    "Estimate peak victim-node voltage from an aggressor voltage step using a capacitive divider: Vv=Va·Cc/(Cc+Cv). This lumped capacitive model excludes inductive coupling, termination, rise time, and transmission-line behavior.",
  inputs: [
    {
      id: "aggressorStepV",
      kind: "number",
      label: "Aggressor voltage step (V)",
    },
    {
      id: "couplingCapacitancePf",
      kind: "number",
      label: "Coupling capacitance (pF)",
      minimum: 0,
    },
    {
      id: "victimCapacitancePf",
      kind: "number",
      label: "Victim node capacitance (pF)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "victimStepV", kind: "number", label: "Victim Step V" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.couplingCapacitancePf + i.victimCapacitancePf === 0)
      simpleError("victimCapacitancePf", "Total capacitance must be positive.");
    const output = {
      victimStepV:
        (i.aggressorStepV * i.couplingCapacitancePf) /
        (i.couplingCapacitancePf + i.victimCapacitancePf),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PcbCrosstalkVoltageInput = Readonly<typeof example.input>;
export type PcbCrosstalkVoltageOutput = Readonly<typeof example.output>;
export const pcbCrosstalkVoltageTool = tool;
export const runPcbCrosstalkVoltage = tool.execute;
export default tool;
