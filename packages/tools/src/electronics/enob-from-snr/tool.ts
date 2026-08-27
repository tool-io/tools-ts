import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const enobFromSnrExample = {
  input: { snrDb: 20 },
} satisfies ToolExample<{
  readonly snrDb: number;
}>;

export const enobFromSnrTool = createSimpleTool({
  id: "electronics/enob-from-snr",
  title: "ENOB From SNR",
  description:
    "Estimate the effective number of bits of a converter from a measured signal-to-noise ratio.",
  inputs: [{ id: "snrDb", label: "SNR", kind: "number" }],
  outputs: [
    {
      id: "effectiveNumberOfBits",
      label: "Effective number of bits",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const snrDb = input.snrDb as number;
    return { effectiveNumberOfBits: (snrDb - 1.76) / 6.02 };
  },
});
export const runEnobFromSnr = enobFromSnrTool.execute;
export default enobFromSnrTool;
