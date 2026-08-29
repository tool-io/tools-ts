import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { coreLossDensityWPerM3: 100000, coreVolumeM3: 0.0001 },
  output: { ironLossW: 10 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/transformer-iron-loss-estimate",
  title: "Transformer Iron Loss Estimate",
  description:
    "Estimate core loss by multiplying a measured or manufacturer-provided loss density by core volume. Use density at the same material, frequency, flux swing, temperature, and waveform; output is watts.",
  inputs: [
    {
      id: "coreLossDensityWPerM3",
      kind: "number",
      label: "Core loss density (W/m³)",
      minimum: 0,
    },
    {
      id: "coreVolumeM3",
      kind: "number",
      label: "Core volume (m³)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "ironLossW", kind: "number", label: "Iron Loss W" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { ironLossW: i.coreLossDensityWPerM3 * i.coreVolumeM3 };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type TransformerIronLossEstimateInput = Readonly<typeof example.input>;
export type TransformerIronLossEstimateOutput = Readonly<typeof example.output>;
export const transformerIronLossEstimateTool = tool;
export const runTransformerIronLossEstimate = tool.execute;
export default tool;
