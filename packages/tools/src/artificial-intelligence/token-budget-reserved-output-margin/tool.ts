import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contextLimit: number;
  readonly inputTokens: number;
  readonly reservedOutputTokens: number;
};
export type Output = {
  readonly remainingTokens: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contextLimit: { type: "integer", minimum: 0 },
    inputTokens: { type: "integer", minimum: 0 },
    reservedOutputTokens: { type: "integer", minimum: 0 },
  },
  required: ["contextLimit", "inputTokens", "reservedOutputTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingTokens: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["remainingTokens", "fits"],
} as const;
/** Reconcile explicit context, input and reserved-output token counts without estimating tokenization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contextLimit, inputTokens, reservedOutputTokens } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(contextLimit) &&
        contextLimit >= 0 &&
        contextLimit <= Number.MAX_SAFE_INTEGER,
      "contextLimit",
    ),
      contextLimit);
    (H.domain(
      Number.isSafeInteger(inputTokens) &&
        inputTokens >= 0 &&
        inputTokens <= Number.MAX_SAFE_INTEGER,
      "inputTokens",
    ),
      inputTokens);
    (H.domain(
      Number.isSafeInteger(reservedOutputTokens) &&
        reservedOutputTokens >= 0 &&
        reservedOutputTokens <= Number.MAX_SAFE_INTEGER,
      "reservedOutputTokens",
    ),
      reservedOutputTokens);
    return {
      remainingTokens: Number(
        BigInt(contextLimit) -
          BigInt(inputTokens) -
          BigInt(reservedOutputTokens),
      ),
      fits:
        BigInt(inputTokens) + BigInt(reservedOutputTokens) <=
        BigInt(contextLimit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contextLimit: 1000, inputTokens: 600, reservedOutputTokens: 250 },
  output: { remainingTokens: 150, fits: true },
} satisfies ToolExample<Input, Output>;
export const tokenBudgetReservedOutputMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: [
        "artificial-intelligence",
        "artificial intelligence",
        "computer science",
      ],
      keywords: ["artificial intelligence", "computer science"],
    },
    id: "artificial-intelligence/token-budget-reserved-output-margin",
    title: "Token Budget Reserved Output Margin",
    description:
      "Reconcile explicit context, input and reserved-output token counts without estimating tokenization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contextLimit: { type: "integer", minimum: 0 },
        inputTokens: { type: "integer", minimum: 0 },
        reservedOutputTokens: { type: "integer", minimum: 0 },
      },
      required: ["contextLimit", "inputTokens", "reservedOutputTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingTokens: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["remainingTokens", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "contextLimit",
          label: "Context Limit",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inputTokens",
          label: "Input Tokens",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reservedOutputTokens",
          label: "Reserved Output Tokens",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingTokens",
          label: "Remaining Tokens",
          valueType: { type: "integer" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = tokenBudgetReservedOutputMarginTool.execute;
export default tokenBudgetReservedOutputMarginTool;
