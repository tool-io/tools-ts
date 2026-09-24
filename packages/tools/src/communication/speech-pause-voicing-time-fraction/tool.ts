import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalSeconds: number;
  readonly pauseSeconds: number;
};
export type Output = {
  readonly voicedSeconds: number;
  readonly voicedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSeconds: { type: "number", exclusiveMinimum: 0 },
    pauseSeconds: { type: "number", minimum: 0 },
  },
  required: ["totalSeconds", "pauseSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voicedSeconds: { type: "number" },
    voicedFraction: { type: "number" },
  },
  required: ["voicedSeconds", "voicedFraction"],
} as const;
/** Calculate speech pause voicing time fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalSeconds, pauseSeconds } = request;
  const compute = (): Output => {
    H.positive(totalSeconds);
    H.domain(pauseSeconds >= 0 && pauseSeconds <= totalSeconds);
    return {
      voicedSeconds: totalSeconds - pauseSeconds,
      voicedFraction: (totalSeconds - pauseSeconds) / totalSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalSeconds: 60, pauseSeconds: 15 },
  output: { voicedSeconds: 45, voicedFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const speechPauseVoicingTimeFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/speech-pause-voicing-time-fraction",
    title: "Speech Pause Voicing Time Fraction Tool",
    description:
      "Calculate speech pause voicing time fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSeconds: { type: "number", exclusiveMinimum: 0 },
        pauseSeconds: { type: "number", minimum: 0 },
      },
      required: ["totalSeconds", "pauseSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voicedSeconds: { type: "number" },
        voicedFraction: { type: "number" },
      },
      required: ["voicedSeconds", "voicedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "totalSeconds",
          label: "Total Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pauseSeconds",
          label: "Pause Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voicedSeconds",
          label: "Voiced Seconds",
          valueType: { type: "number" },
        },
        {
          id: "voicedFraction",
          label: "Voiced Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = speechPauseVoicingTimeFractionTool.execute;
export default speechPauseVoicingTimeFractionTool;
