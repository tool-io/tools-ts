import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhaseNoiseIntegratedJitterSimpleInput = Readonly<{
  readonly integratedPhaseNoiseRatio: number;
  readonly carrierFrequencyHz: number;
}>;
export type PhaseNoiseIntegratedJitterSimpleOutput = Readonly<{
  rmsJitterSeconds: number;
}>;

export const calculatePhaseNoiseIntegratedJitterSimple = (
  i: PhaseNoiseIntegratedJitterSimpleInput,
): PhaseNoiseIntegratedJitterSimpleOutput => {
  const value =
    Math.sqrt(2 * i.integratedPhaseNoiseRatio) /
    (2 * Math.PI * i.carrierFrequencyHz);
  if (!Number.isFinite(value))
    simpleError("rmsJitterSeconds", "The inputs produce a non-finite result.");
  return { rmsJitterSeconds: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { integratedPhaseNoiseRatio: 0.000001, carrierFrequencyHz: 100000000 },
  output: { rmsJitterSeconds: 2.2507907903927653e-12 },
} satisfies ToolExample<
  PhaseNoiseIntegratedJitterSimpleInput,
  PhaseNoiseIntegratedJitterSimpleOutput
>;

export const tool = createSimpleTool({
  id: "electronics/phase-noise-integrated-jitter-simple",
  title: "Phase Noise Integrated Jitter Simple",
  description:
    "Convert integrated single-sideband phase-noise power to RMS timing jitter with sqrt(2A)/(2πfcarrier); A is the dimensionless linear noise-to-carrier integral over the chosen offset band.",
  inputs: [
    {
      id: "integratedPhaseNoiseRatio",
      kind: "number",
      label: "Integrated Phase Noise Ratio",
      minimum: 0,
    },
    {
      id: "carrierFrequencyHz",
      kind: "number",
      label: "Carrier Frequency (Hz)",
      unit: "Hz",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "rmsJitterSeconds",
      kind: "number",
      label: "RMS Jitter (s)",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculatePhaseNoiseIntegratedJitterSimple({
      integratedPhaseNoiseRatio: input.integratedPhaseNoiseRatio as number,
      carrierFrequencyHz: input.carrierFrequencyHz as number,
    }),
});
export const phaseNoiseIntegratedJitterSimpleTool = tool;
export const runPhaseNoiseIntegratedJitterSimple = tool.execute;
export default tool;
