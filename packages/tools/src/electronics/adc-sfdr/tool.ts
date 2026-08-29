import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { fundamentalRms: 1, largestSpurRms: 0.001 },
  output: { sfdrDbc: 60 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/adc-sfdr",
  title: "ADC Spurious-Free Dynamic Range",
  description:
    "Compute SFDR in dBc as 20log₁₀(fundamental RMS amplitude/largest spur RMS amplitude), excluding DC. Use amplitudes measured in the same unit from one spectrum.",
  inputs: [
    {
      id: "fundamentalRms",
      kind: "number",
      label: "Fundamental RMS amplitude",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "largestSpurRms",
      kind: "number",
      label: "Largest spur RMS amplitude",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "sfdrDbc", kind: "number", label: "SFDR dBc" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      sfdrDbc: 20 * Math.log10(i.fundamentalRms / i.largestSpurRms),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type AdcSfdrInput = Readonly<typeof example.input>;
export type AdcSfdrOutput = Readonly<typeof example.output>;
export const adcSfdrTool = tool;
export const runAdcSfdr = tool.execute;
export default tool;
