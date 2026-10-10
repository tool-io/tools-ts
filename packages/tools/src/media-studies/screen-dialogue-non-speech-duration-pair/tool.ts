import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dialogueSeconds: number;
  readonly nonSpeechSeconds: number;
};
export type Output = {
  readonly totalSeconds: number;
  readonly dialogueShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dialogueSeconds: { type: "number", minimum: 0 },
    nonSpeechSeconds: { type: "number", minimum: 0 },
  },
  required: ["dialogueSeconds", "nonSpeechSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSeconds: { type: "number" },
    dialogueShare: { type: "number" },
  },
  required: ["totalSeconds", "dialogueShare"],
} as const;
/** Combine explicitly nonoverlapping dialogue and non-speech durations without detecting speech or interpreting content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dialogueSeconds, nonSpeechSeconds } = request;
  const compute = (): Output => {
    H.domain(dialogueSeconds >= 0 && nonSpeechSeconds >= 0, "dialogueSeconds");
    H.domain(dialogueSeconds + nonSpeechSeconds > 0, "dialogueSeconds");
    return {
      totalSeconds: dialogueSeconds + nonSpeechSeconds,
      dialogueShare: dialogueSeconds / (dialogueSeconds + nonSpeechSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dialogueSeconds: 90, nonSpeechSeconds: 30 },
  output: { totalSeconds: 120, dialogueShare: 0.75 },
} satisfies ToolExample<Input, Output>;
export const screenDialogueNonSpeechDurationPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["media-studies", "media studies", "social sciences"],
        keywords: ["media studies", "social sciences"],
      },
      id: "media-studies/screen-dialogue-non-speech-duration-pair",
      title: "Screen Dialogue Non Speech Duration Pair",
      description:
        "Combine explicitly nonoverlapping dialogue and non-speech durations without detecting speech or interpreting content.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dialogueSeconds: { type: "number", minimum: 0 },
          nonSpeechSeconds: { type: "number", minimum: 0 },
        },
        required: ["dialogueSeconds", "nonSpeechSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalSeconds: { type: "number" },
          dialogueShare: { type: "number" },
        },
        required: ["totalSeconds", "dialogueShare"],
      },
      ports: {
        inputs: [
          {
            id: "dialogueSeconds",
            label: "Dialogue Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nonSpeechSeconds",
            label: "Non Speech Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalSeconds",
            label: "Total Seconds",
            valueType: { type: "number" },
          },
          {
            id: "dialogueShare",
            label: "Dialogue Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = screenDialogueNonSpeechDurationPairTool.execute;
export default screenDialogueNonSpeechDurationPairTool;
