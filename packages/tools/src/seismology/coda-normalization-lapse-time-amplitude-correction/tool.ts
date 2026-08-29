import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const codaNormalizationLapseTimeAmplitudeCorrectionExample = {
  input: {
    lapseTimeSeconds: 60,
    referenceLapseSeconds: 30,
    decayExponentAlpha: 1,
  },
  output: { correctionFactor: 0.5, decibelCorrection: -6.020599913279624 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const codaNormalizationLapseTimeAmplitudeCorrectionTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ lapseTimeSeconds, referenceLapseSeconds, decayExponentAlpha }) => {
        if (!(lapseTimeSeconds > 0) || !(referenceLapseSeconds > 0))
          simpleError("lapseTimeSeconds", "Lapse times must be positive.");
        if ((decayExponentAlpha ?? 1) < 0)
          simpleError(
            "decayExponentAlpha",
            "Decay exponent cannot be negative.",
          );
        const f = Math.pow(
          lapseTimeSeconds / referenceLapseSeconds,
          -(decayExponentAlpha ?? 1.0),
        );
        return { correctionFactor: f, decibelCorrection: 20 * Math.log10(f) };
      })(input as never) as Record<string, unknown>,
    description:
      "Correct coda amplitudes to a reference lapse time using the spreading law A ∝ t^−α.",
    id: "seismology/coda-normalization-lapse-time-amplitude-correction",
    inputs: [
      {
        minimum: 0,
        description: "Lapse time of the measurement.",
        id: "lapseTimeSeconds",
        kind: "number",
        label: "t",
        unit: "s",
      },
      {
        minimum: 0,
        description: "Reference lapse time.",
        id: "referenceLapseSeconds",
        kind: "number",
        label: "t_ref",
        unit: "s",
      },
      {
        default: 1,
        minimum: 0,
        description: "Coda decay exponent.",
        id: "decayExponentAlpha",
        kind: "number",
        label: "α",
      },
    ],
    outputs: [
      {
        description: "Multiplicative amplitude correction.",
        id: "correctionFactor",
        kind: "number",
        label: "(t/t_ref)^−α",
      },
      {
        description: "Correction in decibels.",
        id: "decibelCorrection",
        kind: "number",
        label: "dB",
        unit: "dB",
      },
    ],
    title: "Coda Normalization Lapse Time Amplitude Correction",
  });
export const runCodaNormalizationLapseTimeAmplitudeCorrection =
  codaNormalizationLapseTimeAmplitudeCorrectionTool.execute;
export { codaNormalizationLapseTimeAmplitudeCorrectionExample as example };
export default codaNormalizationLapseTimeAmplitudeCorrectionTool;
