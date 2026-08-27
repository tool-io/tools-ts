import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const adcEnobFromSinadExample = {
  input: { sinadDb: 62 },
} satisfies ToolExample<{
  readonly sinadDb: number;
}>;

export const adcEnobFromSinadTool = createSimpleTool({
  id: "electronics/adc-enob-from-sinad",
  title: "ENOB From SINAD",
  description:
    "Convert SINAD to effective number of bits as enobBits = (sinadDb - 1.76) / 6.02.",
  inputs: [
    {
      description: "Signal-to-noise-and-distortion ratio.",
      id: "sinadDb",
      kind: "number",
      label: "SINAD",
      unit: "dB",
    },
  ],
  outputs: [
    {
      description: "Effective number of bits.",
      id: "enobBits",
      kind: "number",
      label: "ENOB",
      unit: "bits",
    },
  ],
  calculate: (input) => ({
    enobBits: ((input.sinadDb as number) - 1.76) / 6.02,
  }),
});
export const runAdcEnobFromSinad = adcEnobFromSinadTool.execute;
export default adcEnobFromSinadTool;
