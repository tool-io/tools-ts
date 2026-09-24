import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speakerIds: readonly string[];
  readonly wordCounts: readonly number[];
  readonly targetSpeaker: string;
};
export type Output = {
  readonly targetWords: number;
  readonly allWords: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speakerIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    wordCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    targetSpeaker: { type: "string", maxLength: 8192 },
  },
  required: ["speakerIds", "wordCounts", "targetSpeaker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetWords: { type: "integer" },
    allWords: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["targetWords", "allWords", "share", "defined"],
} as const;
/** Count supplied dialogue word allocations without tokenizing text or inferring narrative importance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speakerIds, wordCounts, targetSpeaker } = request;
  const compute = (): Output => {
    H.sameLength(speakerIds, wordCounts);
    H.domain(wordCounts.every((x) => x >= 0));
    const allWords = wordCounts.reduce((a, b) => a + b, 0),
      targetWords = wordCounts.reduce(
        (a, b, i) => a + (speakerIds[i] === targetSpeaker ? b : 0),
        0,
      );
    return {
      targetWords,
      allWords,
      share: allWords > 0 ? targetWords / allWords : 0,
      defined: allWords > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    speakerIds: ["A", "B", "A"],
    wordCounts: [10, 20, 30],
    targetSpeaker: "A",
  },
  output: {
    targetWords: 40,
    allWords: 60,
    share: 0.6666666666666666,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const dialogueTurnWordShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/dialogue-turn-word-share",
    title: "Dialogue Turn Word Share Tool",
    description:
      "Count supplied dialogue word allocations without tokenizing text or inferring narrative importance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speakerIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        wordCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        targetSpeaker: { type: "string", maxLength: 8192 },
      },
      required: ["speakerIds", "wordCounts", "targetSpeaker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetWords: { type: "integer" },
        allWords: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["targetWords", "allWords", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "speakerIds",
          label: "Speaker Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "wordCounts",
          label: "Word Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "targetSpeaker",
          label: "Target Speaker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "targetWords",
          label: "Target Words",
          valueType: { type: "integer" },
        },
        { id: "allWords", label: "All Words", valueType: { type: "integer" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dialogueTurnWordShareTool.execute;
export default dialogueTurnWordShareTool;
