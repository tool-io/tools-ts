import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    traceLengthM: 0.1,
    delayNsPerM: 5,
    roundTrips: 2,
    availableCycleFraction: 0.5,
  },
  output: { maxFrequencyHz: 499999999.99999994 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/spi-max-frequency-from-trace-length",
  title: "SPI Frequency from Trace Delay",
  description:
    "Estimate a conservative SPI clock ceiling from trace length, propagation delay per metre, and available timing fraction of a cycle. This only budgets propagation delay; include device clock-to-output, setup, skew, and return path in a real design.",
  inputs: [
    {
      id: "traceLengthM",
      kind: "number",
      label: "One-way trace length (m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "delayNsPerM",
      kind: "number",
      label: "Propagation delay (ns/m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "roundTrips",
      kind: "number",
      label: "Effective one-way traversals",
      minimum: 1,
    },
    {
      id: "availableCycleFraction",
      kind: "number",
      label: "Available fraction of cycle",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "maxFrequencyHz", kind: "number", label: "Max Frequency Hz" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.availableCycleFraction > 1)
      simpleError(
        "availableCycleFraction",
        "Fraction of a cycle cannot exceed one.",
      );
    const output = {
      maxFrequencyHz:
        i.availableCycleFraction /
        (i.traceLengthM * i.delayNsPerM * 1e-9 * i.roundTrips),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type SpiMaxFrequencyFromTraceLengthInput = Readonly<
  typeof example.input
>;
export type SpiMaxFrequencyFromTraceLengthOutput = Readonly<
  typeof example.output
>;
export const spiMaxFrequencyFromTraceLengthTool = tool;
export const runSpiMaxFrequencyFromTraceLength = tool.execute;
export default tool;
