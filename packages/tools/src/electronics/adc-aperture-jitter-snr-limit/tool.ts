import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AdcApertureJitterSnrLimitInput = Readonly<{
  readonly inputFrequencyHz: number;
  readonly rmsJitterSeconds: number;
}>;
export type AdcApertureJitterSnrLimitOutput = Readonly<{
  jitterLimitedSnrDb: number;
}>;

export const calculateAdcApertureJitterSnrLimit = (
  i: AdcApertureJitterSnrLimitInput,
): AdcApertureJitterSnrLimitOutput => {
  const product = 2 * Math.PI * i.inputFrequencyHz * i.rmsJitterSeconds;
  const value =
    product > 0 && Number.isFinite(product)
      ? -20 * Math.log10(product)
      : -20 *
        (Math.log10(2 * Math.PI) +
          Math.log10(i.inputFrequencyHz) +
          Math.log10(i.rmsJitterSeconds));
  if (!Number.isFinite(value))
    simpleError(
      "jitterLimitedSnrDb",
      "The inputs produce a non-finite result.",
    );
  return { jitterLimitedSnrDb: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { inputFrequencyHz: 10000000, rmsJitterSeconds: 1e-12 },
  output: { jitterLimitedSnrDb: 84.03640263283769 },
} satisfies ToolExample<
  AdcApertureJitterSnrLimitInput,
  AdcApertureJitterSnrLimitOutput
>;

export const tool = createSimpleTool({
  id: "electronics/adc-aperture-jitter-snr-limit",
  title: "ADC Aperture Jitter Snr Limit",
  description:
    "Estimate the aperture-jitter-limited SNR for a sinusoidal ADC input as −20 log10(2πfinput tjitter); this is only the jitter contribution.",
  inputs: [
    {
      id: "inputFrequencyHz",
      kind: "number",
      label: "Input Frequency (Hz)",
      unit: "Hz",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "rmsJitterSeconds",
      kind: "number",
      label: "RMS Jitter (s)",
      unit: "s",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "jitterLimitedSnrDb",
      kind: "number",
      label: "Jitter Limited Snr (dB)",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateAdcApertureJitterSnrLimit({
      inputFrequencyHz: input.inputFrequencyHz as number,
      rmsJitterSeconds: input.rmsJitterSeconds as number,
    }),
});
export const adcApertureJitterSnrLimitTool = tool;
export const runAdcApertureJitterSnrLimit = tool.execute;
export default tool;
