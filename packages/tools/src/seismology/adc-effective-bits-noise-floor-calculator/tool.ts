import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const adcEffectiveBitsNoiseFloorCalculatorExample = {
  input: { nominalBits: 24, sndrDb: 98 },
  output: {
    effectiveBits: (98 - 1.76) / 6.02,
    lostBits: 24 - (98 - 1.76) / 6.02,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const adcEffectiveBitsNoiseFloorCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ nominalBits, sndrDb }) => {
      const enob = (sndrDb - 1.76) / 6.02;
      return { effectiveBits: enob, lostBits: nominalBits - enob };
    })(input as never) as Record<string, unknown>,
  description:
    "Effective number of bits from the measured SNDR: ENOB = (SNDR − 1.76)/6.02.",
  id: "seismology/adc-effective-bits-noise-floor-calculator",
  inputs: [
    {
      minimum: 1,
      description: "Converter bit depth.",
      id: "nominalBits",
      kind: "integer",
      label: "N",
    },
    {
      description: "Measured signal-to-noise-and-distortion ratio.",
      id: "sndrDb",
      kind: "number",
      label: "SNDR_dB",
    },
  ],
  outputs: [
    {
      description: "Effective number of bits.",
      id: "effectiveBits",
      kind: "number",
      label: "ENOB",
    },
    {
      description: "Bits lost to noise and nonlinearity.",
      id: "lostBits",
      kind: "number",
      label: "Δbits",
    },
  ],
  title: "ADC Effective Bits Noise Floor Calculator",
});
export const runAdcEffectiveBitsNoiseFloorCalculator =
  adcEffectiveBitsNoiseFloorCalculatorTool.execute;
export { adcEffectiveBitsNoiseFloorCalculatorExample as example };
export default adcEffectiveBitsNoiseFloorCalculatorTool;
