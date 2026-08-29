import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { rmsVoltageV: 120, frequencyHz: 60, magnetizingInductanceH: 10 },
  output: { magnetizingCurrentA: 0.03183098861837907 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/transformer-magnetizing-current",
  title: "Transformer Magnetizing Current",
  description:
    "Estimate sinusoidal RMS magnetizing current as V/(2πfLm) for a linear magnetizing inductance. Core saturation, hysteresis, and winding resistance are excluded.",
  inputs: [
    {
      id: "rmsVoltageV",
      kind: "number",
      label: "Applied RMS voltage (V)",
      minimum: 0,
    },
    {
      id: "frequencyHz",
      kind: "number",
      label: "Frequency (Hz)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "magnetizingInductanceH",
      kind: "number",
      label: "Magnetizing inductance (H)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "magnetizingCurrentA",
      kind: "number",
      label: "Magnetizing Current A",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      magnetizingCurrentA:
        i.rmsVoltageV /
        (2 * Math.PI * i.frequencyHz * i.magnetizingInductanceH),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type TransformerMagnetizingCurrentInput = Readonly<typeof example.input>;
export type TransformerMagnetizingCurrentOutput = Readonly<
  typeof example.output
>;
export const transformerMagnetizingCurrentTool = tool;
export const runTransformerMagnetizingCurrent = tool.execute;
export default tool;
