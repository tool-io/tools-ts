import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { frequencyHz: 100000, inductanceH: 0.0001, seriesResistanceOhm: 1 },
  output: { qualityFactor: 62.83185307179586 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/inductor-q-at-frequency",
  title: "Inductor Q at Frequency",
  description:
    "Calculate series-model inductor quality factor Q=2πfL/R from inductance and effective series resistance at the specified frequency. Core and skin-effect losses should be included in the supplied resistance.",
  inputs: [
    { id: "frequencyHz", kind: "number", label: "Frequency (Hz)", minimum: 0 },
    { id: "inductanceH", kind: "number", label: "Inductance (H)", minimum: 0 },
    {
      id: "seriesResistanceOhm",
      kind: "number",
      label: "Effective series resistance (Ω)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "qualityFactor", kind: "number", label: "Quality Factor" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      qualityFactor:
        (2 * Math.PI * i.frequencyHz * i.inductanceH) / i.seriesResistanceOhm,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type InductorQAtFrequencyInput = Readonly<typeof example.input>;
export type InductorQAtFrequencyOutput = Readonly<typeof example.output>;
export const inductorQAtFrequencyTool = tool;
export const runInductorQAtFrequency = tool.execute;
export default tool;
