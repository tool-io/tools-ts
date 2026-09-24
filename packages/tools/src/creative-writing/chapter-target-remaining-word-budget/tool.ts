import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetWords: number;
  readonly draftedWords: number;
  readonly reservedWords: number;
};
export type Output = {
  readonly remaining: number;
  readonly freeBudget: number;
  readonly overTarget: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetWords: { type: "integer", minimum: 0 },
    draftedWords: { type: "integer", minimum: 0 },
    reservedWords: { type: "integer", minimum: 0 },
  },
  required: ["targetWords", "draftedWords", "reservedWords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "integer" },
    freeBudget: { type: "integer" },
    overTarget: { type: "boolean" },
  },
  required: ["remaining", "freeBudget", "overTarget"],
} as const;
/** Calculate chapter target remaining word budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetWords, draftedWords, reservedWords } = request;
  const compute = (): Output => {
    H.integer(targetWords, 0);
    H.integer(draftedWords, 0);
    H.integer(reservedWords, 0);
    return {
      remaining: targetWords - draftedWords,
      freeBudget: targetWords - draftedWords - reservedWords,
      overTarget: draftedWords > targetWords,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetWords: 5000, draftedWords: 3200, reservedWords: 300 },
  output: { remaining: 1800, freeBudget: 1500, overTarget: false },
} satisfies ToolExample<Input, Output>;
export const chapterTargetRemainingWordBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/chapter-target-remaining-word-budget",
    title: "Chapter Target Remaining Word Budget Tool",
    description:
      "Calculate chapter target remaining word budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetWords: { type: "integer", minimum: 0 },
        draftedWords: { type: "integer", minimum: 0 },
        reservedWords: { type: "integer", minimum: 0 },
      },
      required: ["targetWords", "draftedWords", "reservedWords"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "integer" },
        freeBudget: { type: "integer" },
        overTarget: { type: "boolean" },
      },
      required: ["remaining", "freeBudget", "overTarget"],
    },
    ports: {
      inputs: [
        {
          id: "targetWords",
          label: "Target Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "draftedWords",
          label: "Drafted Words",
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
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        {
          id: "freeBudget",
          label: "Free Budget",
          valueType: { type: "integer" },
        },
        {
          id: "overTarget",
          label: "Over Target",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = chapterTargetRemainingWordBudgetTool.execute;
export default chapterTargetRemainingWordBudgetTool;
