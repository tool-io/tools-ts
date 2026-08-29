import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    cableLengthM: 40,
    delayNsPerM: 5,
    transceiverRoundTripNs: 200,
    propagationFraction: 0.7,
  },
  output: { maxBitRateBps: 1166666.6666666665 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/can-bus-bit-rate-from-length",
  title: "CAN Bit Rate from Cable Delay",
  description:
    "Estimate a CAN bit-rate ceiling using cable length, one-way propagation delay per metre, transceiver delay, and the permitted propagation fraction of a bit. This is a timing-budget estimate, not a substitute for bit-timing analysis.",
  inputs: [
    {
      id: "cableLengthM",
      kind: "number",
      label: "Bus length (m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "delayNsPerM",
      kind: "number",
      label: "Cable delay (ns/m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "transceiverRoundTripNs",
      kind: "number",
      label: "Transceiver round-trip delay (ns)",
      minimum: 0,
    },
    {
      id: "propagationFraction",
      kind: "number",
      label: "Propagation time fraction",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "maxBitRateBps", kind: "number", label: "Max Bit Rate Bps" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.propagationFraction > 1)
      simpleError(
        "propagationFraction",
        "Fraction of a bit cannot exceed one.",
      );
    const output = {
      maxBitRateBps:
        i.propagationFraction /
        (2 * i.cableLengthM * i.delayNsPerM * 1e-9 +
          i.transceiverRoundTripNs * 1e-9),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type CanBusBitRateFromLengthInput = Readonly<typeof example.input>;
export type CanBusBitRateFromLengthOutput = Readonly<typeof example.output>;
export const canBusBitRateFromLengthTool = tool;
export const runCanBusBitRateFromLength = tool.execute;
export default tool;
