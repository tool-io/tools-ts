import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    clockPeriodNs: 10,
    clockToOutputNs: 1,
    pathDelayNs: 3,
    setupTimeNs: 1,
    adverseSkewNs: 0.5,
    jitterNs: 0.5,
  },
  output: { setupSlackNs: 4 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/fpga-setup-time-slack",
  title: "FPGA Setup Time Slack",
  description:
    "Compute worst-case setup slack as period−clock-to-output−maximum path delay−setup−adverse skew−jitter. Positive slack meets this simplified single-cycle timing constraint.",
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
      label: "Clock-to-output max (ns)",
      minimum: 0,
    },
    {
      id: "pathDelayNs",
      kind: "number",
      label: "Path delay max (ns)",
      minimum: 0,
    },
    { id: "setupTimeNs", kind: "number", label: "Setup time (ns)", minimum: 0 },
    {
      id: "adverseSkewNs",
      kind: "number",
      label: "Adverse skew (ns)",
      minimum: 0,
    },
    {
      id: "jitterNs",
      kind: "number",
      label: "Jitter allowance (ns)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "setupSlackNs", kind: "number", label: "Setup Slack ns" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      setupSlackNs:
        i.clockPeriodNs -
        i.clockToOutputNs -
        i.pathDelayNs -
        i.setupTimeNs -
        i.adverseSkewNs -
        i.jitterNs,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type FpgaSetupTimeSlackInput = Readonly<typeof example.input>;
export type FpgaSetupTimeSlackOutput = Readonly<typeof example.output>;
export const fpgaSetupTimeSlackTool = tool;
export const runFpgaSetupTimeSlack = tool.execute;
export default tool;
