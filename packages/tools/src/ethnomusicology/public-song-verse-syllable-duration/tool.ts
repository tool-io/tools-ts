import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly syllables: number;
  readonly durationSeconds: number;
  readonly unvoicedSeconds: number;
};
export type Output = {
  readonly voicedSeconds: number;
  readonly syllablesPerVoicedSecond: number;
  readonly meanSecondsPerSyllable: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    syllables: { type: "integer", minimum: 1 },
    durationSeconds: { type: "number" },
    unvoicedSeconds: { type: "number", minimum: 0 },
  },
  required: ["syllables", "durationSeconds", "unvoicedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voicedSeconds: { type: "number" },
    syllablesPerVoicedSecond: { type: "number" },
    meanSecondsPerSyllable: { type: "number" },
  },
  required: [
    "voicedSeconds",
    "syllablesPerVoicedSecond",
    "meanSecondsPerSyllable",
  ],
} as const;
/** Calculate public song verse syllable duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { syllables, durationSeconds, unvoicedSeconds } = request;
  const compute = (): Output => {
    H.integer(syllables, 1);
    H.domain(unvoicedSeconds >= 0 && durationSeconds > unvoicedSeconds);
    return {
      voicedSeconds: durationSeconds - unvoicedSeconds,
      syllablesPerVoicedSecond: syllables / (durationSeconds - unvoicedSeconds),
      meanSecondsPerSyllable: (durationSeconds - unvoicedSeconds) / syllables,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { syllables: 24, durationSeconds: 12, unvoicedSeconds: 4 },
  output: {
    voicedSeconds: 8,
    syllablesPerVoicedSecond: 3,
    meanSecondsPerSyllable: 0.3333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const publicSongVerseSyllableDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/public-song-verse-syllable-duration",
    title: "Public Song Verse Syllable Duration Tool",
    description:
      "Calculate public song verse syllable duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        syllables: { type: "integer", minimum: 1 },
        durationSeconds: { type: "number" },
        unvoicedSeconds: { type: "number", minimum: 0 },
      },
      required: ["syllables", "durationSeconds", "unvoicedSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voicedSeconds: { type: "number" },
        syllablesPerVoicedSecond: { type: "number" },
        meanSecondsPerSyllable: { type: "number" },
      },
      required: [
        "voicedSeconds",
        "syllablesPerVoicedSecond",
        "meanSecondsPerSyllable",
      ],
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
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "unvoicedSeconds",
          label: "Unvoiced Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "voicedSeconds",
          label: "Voiced Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "syllablesPerVoicedSecond",
          label: "Syllables Per Voiced Second",
          valueType: { type: "number" },
        },
        {
          id: "meanSecondsPerSyllable",
          label: "Mean Seconds Per Syllable",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicSongVerseSyllableDurationTool.execute;
export default publicSongVerseSyllableDurationTool;
