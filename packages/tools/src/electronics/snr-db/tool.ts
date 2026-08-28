import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const snrDbExample = {
  input: { snrLinear: 100 },
} satisfies ToolExample<{
  readonly snrLinear: number;
}>;

export const snrDbTool = createSimpleTool({
  id: "electronics/snr-db",
  title: "SNR To dB",
  description:
    "Convert a linear signal-to-noise ratio to an equivalent ratio in decibels.",
  inputs: [{ id: "snrLinear", label: "SNR", kind: "number" }],
  outputs: [{ id: "snrDb", label: "SNR", kind: "number" }],
  calculate: (input) => {
    const snrLinear = input.snrLinear as number;
    if (snrLinear <= 0)
      simpleError("snrLinear", "SNR must be greater than zero.");
    return { snrDb: 10 * Math.log10(snrLinear) };
  },
});
export const runSnrDb = snrDbTool.execute;
export default snrDbTool;
