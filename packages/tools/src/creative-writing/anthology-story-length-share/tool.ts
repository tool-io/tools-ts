import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly storyWords: number;
  readonly anthologyWords: number;
  readonly reservedWords: number;
};
export type Output = {
  readonly share: number;
  readonly unreservedWords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storyWords: { type: "integer", minimum: 0 },
    anthologyWords: { type: "integer", minimum: 1 },
    reservedWords: { type: "integer", minimum: 0 },
  },
  required: ["storyWords", "anthologyWords", "reservedWords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    share: { type: "number" },
    unreservedWords: { type: "integer" },
  },
  required: ["share", "unreservedWords"],
} as const;
/** Calculate anthology story length share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storyWords, anthologyWords, reservedWords } = request;
  const compute = (): Output => {
    H.integer(anthologyWords, 1);
    H.integer(storyWords, 0, anthologyWords);
    H.integer(reservedWords, 0, anthologyWords - storyWords);
    return {
      share: storyWords / anthologyWords,
      unreservedWords: anthologyWords - storyWords - reservedWords,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storyWords: 8000, anthologyWords: 80000, reservedWords: 2000 },
  output: { share: 0.1, unreservedWords: 70000 },
} satisfies ToolExample<Input, Output>;
export const anthologyStoryLengthShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/anthology-story-length-share",
    title: "Anthology Story Length Share Tool",
    description:
      "Calculate anthology story length share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storyWords: { type: "integer", minimum: 0 },
        anthologyWords: { type: "integer", minimum: 1 },
        reservedWords: { type: "integer", minimum: 0 },
      },
      required: ["storyWords", "anthologyWords", "reservedWords"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        share: { type: "number" },
        unreservedWords: { type: "integer" },
      },
      required: ["share", "unreservedWords"],
    },
    ports: {
      inputs: [
        {
          id: "storyWords",
          label: "Story Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "anthologyWords",
          label: "Anthology Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reservedWords",
          label: "Reserved Words",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "unreservedWords",
          label: "Unreserved Words",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = anthologyStoryLengthShareTool.execute;
export default anthologyStoryLengthShareTool;
