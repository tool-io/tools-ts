import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly syllables: number;
  readonly durationSeconds: number;
  readonly silenceSeconds: number;
  readonly excludedSeconds: number;
};
export type Output = {
  readonly speakingSeconds: number;
  readonly grossPerMinute: number;
  readonly articulationPerMinute: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    syllables: { type: "integer", minimum: 0 },
    durationSeconds: { type: "number" },
    silenceSeconds: { type: "number", minimum: 0 },
    excludedSeconds: { type: "number", minimum: 0 },
  },
  required: [
    "syllables",
    "durationSeconds",
    "silenceSeconds",
    "excludedSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speakingSeconds: { type: "number" },
    grossPerMinute: { type: "number" },
    articulationPerMinute: { type: "number" },
  },
  required: ["speakingSeconds", "grossPerMinute", "articulationPerMinute"],
} as const;
/** Calculate speech sample syllables time rate term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { syllables, durationSeconds, silenceSeconds, excludedSeconds } =
    request;
  const compute = (): Output => {
    H.integer(syllables, 0);
    H.domain(
      silenceSeconds >= 0 &&
        excludedSeconds >= 0 &&
        durationSeconds > silenceSeconds + excludedSeconds,
    );
    return {
      speakingSeconds: durationSeconds - silenceSeconds - excludedSeconds,
      grossPerMinute: (60 * syllables) / durationSeconds,
      articulationPerMinute:
        (60 * syllables) / (durationSeconds - silenceSeconds - excludedSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    syllables: 120,
    durationSeconds: 60,
    silenceSeconds: 10,
    excludedSeconds: 5,
  },
  output: {
    speakingSeconds: 45,
    grossPerMinute: 120,
    articulationPerMinute: 160,
  },
} satisfies ToolExample<Input, Output>;
export const speechSampleSyllablesTimeRateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/speech-sample-syllables-time-rate-term",
    title: "Speech Sample Syllables Time Rate Term Tool",
    description:
      "Calculate speech sample syllables time rate term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        syllables: { type: "integer", minimum: 0 },
        durationSeconds: { type: "number" },
        silenceSeconds: { type: "number", minimum: 0 },
        excludedSeconds: { type: "number", minimum: 0 },
      },
      required: [
        "syllables",
        "durationSeconds",
        "silenceSeconds",
        "excludedSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speakingSeconds: { type: "number" },
        grossPerMinute: { type: "number" },
        articulationPerMinute: { type: "number" },
      },
      required: ["speakingSeconds", "grossPerMinute", "articulationPerMinute"],
    },
    ports: {
      inputs: [
        {
          id: "syllables",
          label: "Syllables",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "silenceSeconds",
          label: "Silence Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedSeconds",
          label: "Excluded Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "speakingSeconds",
          label: "Speaking Seconds",
          valueType: { type: "number" },
        },
        {
          id: "grossPerMinute",
          label: "Gross Per Minute",
          valueType: { type: "number" },
        },
        {
          id: "articulationPerMinute",
          label: "Articulation Per Minute",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = speechSampleSyllablesTimeRateTermTool.execute;
export default speechSampleSyllablesTimeRateTermTool;
