import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetWords: number;
  readonly draftedWords: number;
};
export type Output = {
  readonly remainingWords: number;
  readonly overBudgetWords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetWords: { type: "integer", minimum: 0 },
    draftedWords: { type: "integer", minimum: 0 },
  },
  required: ["targetWords", "draftedWords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingWords: { type: "integer" },
    overBudgetWords: { type: "integer" },
  },
  required: ["remainingWords", "overBudgetWords"],
} as const;
/** Compare an explicitly counted scene draft with its word target, separating remaining and excess words. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetWords, draftedWords } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(targetWords) &&
        targetWords >= 0 &&
        targetWords <= Number.MAX_SAFE_INTEGER,
      "targetWords",
    ),
      targetWords);
    (H.domain(
      Number.isSafeInteger(draftedWords) &&
        draftedWords >= 0 &&
        draftedWords <= Number.MAX_SAFE_INTEGER,
      "draftedWords",
    ),
      draftedWords);
    return {
      remainingWords: Math.max(0, targetWords - draftedWords),
      overBudgetWords: Math.max(0, draftedWords - targetWords),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetWords: 1200, draftedWords: 850 },
  output: { remainingWords: 350, overBudgetWords: 0 },
} satisfies ToolExample<Input, Output>;
export const sceneWordBudgetRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/scene-word-budget-remainder",
    title: "Scene Word Budget Remainder",
    description:
      "Compare an explicitly counted scene draft with its word target, separating remaining and excess words.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetWords: { type: "integer", minimum: 0 },
        draftedWords: { type: "integer", minimum: 0 },
      },
      required: ["targetWords", "draftedWords"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingWords: { type: "integer" },
        overBudgetWords: { type: "integer" },
      },
      required: ["remainingWords", "overBudgetWords"],
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
      ],
      outputs: [
        {
          id: "remainingWords",
          label: "Remaining Words",
          valueType: { type: "integer" },
        },
        {
          id: "overBudgetWords",
          label: "Over Budget Words",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sceneWordBudgetRemainderTool.execute;
export default sceneWordBudgetRemainderTool;
