import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { cableLengthM: 100, velocityFactor: 0.66 },
  output: { oneWayDelayNs: 505.4001442396243 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/ethernet-cable-delay",
  title: "Ethernet Cable Propagation Delay",
  description:
    "Estimate one-way signal propagation delay from cable length and velocity factor relative to light speed. Actual velocity factor depends on cable construction; this does not include switch or PHY latency.",
  inputs: [
    {
      id: "cableLengthM",
      kind: "number",
      label: "Cable length (m)",
      minimum: 0,
    },
    {
      id: "velocityFactor",
      kind: "number",
      label: "Velocity factor",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "oneWayDelayNs", kind: "number", label: "One Way Delay ns" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.velocityFactor > 1)
      simpleError("velocityFactor", "Velocity factor cannot exceed one.");
    const output = {
      oneWayDelayNs: (i.cableLengthM / (299792458 * i.velocityFactor)) * 1e9,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type EthernetCableDelayInput = Readonly<typeof example.input>;
export type EthernetCableDelayOutput = Readonly<typeof example.output>;
export const ethernetCableDelayTool = tool;
export const runEthernetCableDelay = tool.execute;
export default tool;
