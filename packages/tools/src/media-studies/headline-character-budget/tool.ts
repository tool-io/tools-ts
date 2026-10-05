import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headline: string;
  readonly maximumCodePoints: number;
};
export type Output = {
  readonly usedCodePoints: number;
  readonly remainingCodePoints: number;
  readonly withinBudget: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string", maxLength: 8192 },
    maximumCodePoints: { type: "integer", minimum: 0 },
  },
  required: ["headline", "maximumCodePoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usedCodePoints: { type: "integer" },
    remainingCodePoints: { type: "integer" },
    withinBudget: { type: "boolean" },
  },
  required: ["usedCodePoints", "remainingCodePoints", "withinBudget"],
} as const;
/** Check a headline against a Unicode code-point budget; grapheme clusters and display width are not counted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headline, maximumCodePoints } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(maximumCodePoints) &&
        maximumCodePoints >= 0 &&
        maximumCodePoints <= Number.MAX_SAFE_INTEGER,
      "maximumCodePoints",
    ),
      maximumCodePoints);
    const usedCodePoints = [...headline].length;
    return {
      usedCodePoints,
      remainingCodePoints: maximumCodePoints - usedCodePoints,
      withinBudget: usedCodePoints <= maximumCodePoints,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headline: "News today", maximumCodePoints: 20 },
  output: { usedCodePoints: 10, remainingCodePoints: 10, withinBudget: true },
} satisfies ToolExample<Input, Output>;
export const headlineCharacterBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/headline-character-budget",
    title: "Headline Character Budget Tool",
    description:
      "Check a headline against a Unicode code-point budget; grapheme clusters and display width are not counted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headline: { type: "string", maxLength: 8192 },
        maximumCodePoints: { type: "integer", minimum: 0 },
      },
      required: ["headline", "maximumCodePoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usedCodePoints: { type: "integer" },
        remainingCodePoints: { type: "integer" },
        withinBudget: { type: "boolean" },
      },
      required: ["usedCodePoints", "remainingCodePoints", "withinBudget"],
    },
    ports: {
      inputs: [
        {
          id: "headline",
          label: "Headline",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "maximumCodePoints",
          label: "Maximum Code Points",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "usedCodePoints",
          label: "Used Code Points",
          valueType: { type: "integer" },
        },
        {
          id: "remainingCodePoints",
          label: "Remaining Code Points",
          valueType: { type: "integer" },
        },
        {
          id: "withinBudget",
          label: "Within Budget",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = headlineCharacterBudgetTool.execute;
export default headlineCharacterBudgetTool;
