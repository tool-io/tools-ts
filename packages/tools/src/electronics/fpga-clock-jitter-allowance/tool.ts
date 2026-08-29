import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    clockPeriodNs: 10,
    clockToOutputNs: 1,
    pathDelayNs: 3,
    setupTimeNs: 1,
    clockSkewNs: 0.5,
  },
  output: { jitterAllowanceNs: 4.5 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/fpga-clock-jitter-allowance",
  title: "FPGA Clock Jitter Allowance",
  description:
    "Calculate remaining setup-time budget for combined clock jitter after clock period, clock-to-output, combinational path delay, setup time, and skew. Use worst-case values in the same time unit.",
  inputs: [
    {
      id: "clockPeriodNs",
      kind: "number",
      label: "Clock period (ns)",
      minimum: 0,
    },
    {
      id: "clockToOutputNs",
      kind: "number",
      label: "Clock-to-output (ns)",
      minimum: 0,
    },
    { id: "pathDelayNs", kind: "number", label: "Path delay (ns)", minimum: 0 },
    { id: "setupTimeNs", kind: "number", label: "Setup time (ns)", minimum: 0 },
    {
      id: "clockSkewNs",
      kind: "number",
      label: "Adverse clock skew (ns)",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "jitterAllowanceNs", kind: "number", label: "Jitter Allowance ns" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      jitterAllowanceNs:
        i.clockPeriodNs -
        i.clockToOutputNs -
        i.pathDelayNs -
        i.setupTimeNs -
        i.clockSkewNs,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type FpgaClockJitterAllowanceInput = Readonly<typeof example.input>;
export type FpgaClockJitterAllowanceOutput = Readonly<typeof example.output>;
export const fpgaClockJitterAllowanceTool = tool;
export const runFpgaClockJitterAllowance = tool.execute;
export default tool;
