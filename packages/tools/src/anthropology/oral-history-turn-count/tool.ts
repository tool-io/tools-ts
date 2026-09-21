import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speakerIds: readonly string[];
  readonly excludedSpeakers: readonly string[];
  readonly mergeConsecutive: boolean;
};
export type Output = {
  readonly turnCount: number;
  readonly retainedEntries: number;
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
    excludedSpeakers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    mergeConsecutive: { type: "boolean" },
  },
  required: ["speakerIds", "excludedSpeakers", "mergeConsecutive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turnCount: { type: "integer" },
    retainedEntries: { type: "integer" },
  },
  required: ["turnCount", "retainedEntries"],
} as const;
/** Count supplied transcript speaker turns under explicit exclusion and consecutive-entry rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speakerIds, excludedSpeakers, mergeConsecutive } = request;
  const compute = (): Output => {
    const retained = speakerIds.filter((x) => !excludedSpeakers.includes(x));
    return {
      turnCount: mergeConsecutive
        ? retained.filter((x, i) => i === 0 || x !== retained[i - 1]).length
        : retained.length,
      retainedEntries: retained.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    speakerIds: ["A", "A", "X", "B", "B", "A"],
    excludedSpeakers: ["X"],
    mergeConsecutive: true,
  },
  output: { turnCount: 3, retainedEntries: 5 },
} satisfies ToolExample<Input, Output>;
export const oralHistoryTurnCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/oral-history-turn-count",
    title: "Oral History Turn Count Tool",
    description:
      "Count supplied transcript speaker turns under explicit exclusion and consecutive-entry rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speakerIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        excludedSpeakers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        mergeConsecutive: { type: "boolean" },
      },
      required: ["speakerIds", "excludedSpeakers", "mergeConsecutive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        turnCount: { type: "integer" },
        retainedEntries: { type: "integer" },
      },
      required: ["turnCount", "retainedEntries"],
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
          id: "excludedSpeakers",
          label: "Excluded Speakers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "mergeConsecutive",
          label: "Merge Consecutive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "turnCount",
          label: "Turn Count",
          valueType: { type: "integer" },
        },
        {
          id: "retainedEntries",
          label: "Retained Entries",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = oralHistoryTurnCountTool.execute;
export default oralHistoryTurnCountTool;
