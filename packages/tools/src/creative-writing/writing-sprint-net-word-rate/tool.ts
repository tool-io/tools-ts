import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly addedWords: number;
  readonly deletedWords: number;
  readonly elapsedMinutes: number;
  readonly pauseMinutes: number;
};
export type Output = {
  readonly netWords: number;
  readonly activeMinutes: number;
  readonly netWordsPerMinute: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    addedWords: { type: "integer", minimum: 0 },
    deletedWords: { type: "integer", minimum: 0 },
    elapsedMinutes: { type: "number" },
    pauseMinutes: { type: "number", minimum: 0 },
  },
  required: ["addedWords", "deletedWords", "elapsedMinutes", "pauseMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netWords: { type: "integer" },
    activeMinutes: { type: "number" },
    netWordsPerMinute: { type: "number" },
  },
  required: ["netWords", "activeMinutes", "netWordsPerMinute"],
} as const;
/** Calculate writing sprint net word rate from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { addedWords, deletedWords, elapsedMinutes, pauseMinutes } = request;
  const compute = (): Output => {
    H.integer(addedWords, 0);
    H.integer(deletedWords, 0);
    H.domain(pauseMinutes >= 0 && elapsedMinutes > pauseMinutes);
    return {
      netWords: addedWords - deletedWords,
      activeMinutes: elapsedMinutes - pauseMinutes,
      netWordsPerMinute:
        (addedWords - deletedWords) / (elapsedMinutes - pauseMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    addedWords: 600,
    deletedWords: 100,
    elapsedMinutes: 30,
    pauseMinutes: 5,
  },
  output: { netWords: 500, activeMinutes: 25, netWordsPerMinute: 20 },
} satisfies ToolExample<Input, Output>;
export const writingSprintNetWordRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/writing-sprint-net-word-rate",
    title: "Writing Sprint Net Word Rate Tool",
    description:
      "Calculate writing sprint net word rate from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        addedWords: { type: "integer", minimum: 0 },
        deletedWords: { type: "integer", minimum: 0 },
        elapsedMinutes: { type: "number" },
        pauseMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "addedWords",
        "deletedWords",
        "elapsedMinutes",
        "pauseMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netWords: { type: "integer" },
        activeMinutes: { type: "number" },
        netWordsPerMinute: { type: "number" },
      },
      required: ["netWords", "activeMinutes", "netWordsPerMinute"],
    },
    ports: {
      inputs: [
        {
          id: "addedWords",
          label: "Added Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "deletedWords",
          label: "Deleted Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "pauseMinutes",
          label: "Pause Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        { id: "netWords", label: "Net Words", valueType: { type: "integer" } },
        {
          id: "activeMinutes",
          label: "Active Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "netWordsPerMinute",
          label: "Net Words Per Minute",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = writingSprintNetWordRateTool.execute;
export default writingSprintNetWordRateTool;
