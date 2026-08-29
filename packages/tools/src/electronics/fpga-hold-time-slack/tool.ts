import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    clockToOutputMinNs: 0.5,
    pathDelayMinNs: 0.8,
    holdTimeNs: 0.4,
    adverseSkewNs: 0.2,
  },
  output: { holdSlackNs: 0.7 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/fpga-hold-time-slack",
  title: "FPGA Hold Time Slack",
  description:
    "Compute simplified hold slack as minimum clock-to-output plus minimum data-path delay minus hold time and adverse skew. Positive slack meets this model; use actual launch/capture clock paths for sign-off.",
  inputs: [
    {
      id: "clockToOutputMinNs",
      kind: "number",
      label: "Clock-to-output min (ns)",
      minimum: 0,
    },
    {
      id: "pathDelayMinNs",
      kind: "number",
      label: "Path delay min (ns)",
      minimum: 0,
    },
    { id: "holdTimeNs", kind: "number", label: "Hold time (ns)", minimum: 0 },
    {
      id: "adverseSkewNs",
      kind: "number",
      label: "Adverse skew (ns)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "holdSlackNs", kind: "number", label: "Hold Slack ns" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      holdSlackNs:
        i.clockToOutputMinNs +
        i.pathDelayMinNs -
        i.holdTimeNs -
        i.adverseSkewNs,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type FpgaHoldTimeSlackInput = Readonly<typeof example.input>;
export type FpgaHoldTimeSlackOutput = Readonly<typeof example.output>;
export const fpgaHoldTimeSlackTool = tool;
export const runFpgaHoldTimeSlack = tool.execute;
export default tool;
