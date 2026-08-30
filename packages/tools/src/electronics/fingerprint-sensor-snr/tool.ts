import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FingerprintSensorSnrInput = Readonly<{
  readonly signalRms: number;
  readonly noiseRms: number;
}>;
export type FingerprintSensorSnrOutput = Readonly<{
  readonly snrDb: number;
}>;

export const calculateFingerprintSensorSnr = (
  x: FingerprintSensorSnrInput,
): FingerprintSensorSnrOutput => {
  if (!Number.isFinite(x.signalRms) || x.signalRms < 0)
    simpleError("signalRms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.noiseRms) || x.noiseRms < 0)
    simpleError("noiseRms", "Provide a finite number at least 0.");
  if (!(x.signalRms > 0 && x.noiseRms > 0))
    simpleError("input", "Signal and noise amplitudes must be positive.");
  const snrDb = 20 * Math.log10(x.signalRms / x.noiseRms);
  if (!Number.isFinite(snrDb))
    simpleError("snrDb", "The inputs produce an invalid result.");
  return { snrDb: Object.is(snrDb, -0) ? 0 : snrDb };
};

export const example = {
  input: { signalRms: 100, noiseRms: 10 },
  output: { snrDb: 20 },
} satisfies ToolExample<FingerprintSensorSnrInput, FingerprintSensorSnrOutput>;

export const tool = createSimpleTool({
  id: "electronics/fingerprint-sensor-snr",
  title: "Fingerprint Sensor SNR",
  description:
    "Express a fingerprint sensor's measured RMS image-signal amplitude divided by RMS noise as voltage SNR in decibels.",
  inputs: [
    {
      id: "signalRms",
      kind: "number",
      label: "RMS signal amplitude",
      minimum: 0,
    },
    {
      id: "noiseRms",
      kind: "number",
      label: "RMS noise amplitude",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "snrDb", kind: "number", label: "Signal-to-noise ratio", unit: "dB" },
  ],
  calculate: (input) =>
    calculateFingerprintSensorSnr({
      signalRms: input.signalRms as number,
      noiseRms: input.noiseRms as number,
    }),
});
export const fingerprintSensorSnrTool = tool;
export const runFingerprintSensorSnr = tool.execute;
export default tool;
