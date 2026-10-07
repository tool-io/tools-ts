import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokenCount: number;
  readonly moneyPerToken: number;
};
export type Output = { readonly cashValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokenCount: { type: "integer", minimum: 0 },
    moneyPerToken: { type: "number", minimum: 0 },
  },
  required: ["tokenCount", "moneyPerToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cashValue: { type: "number" } },
  required: ["cashValue"],
} as const;
/** Convert supplied experimental tokens to money using an explicit nonnegative exchange rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokenCount, moneyPerToken } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(tokenCount) &&
        tokenCount >= 0 &&
        tokenCount <= Number.MAX_SAFE_INTEGER,
      "tokenCount",
    ),
      tokenCount);
    H.domain(moneyPerToken >= 0, "moneyPerToken");
    return { cashValue: tokenCount * moneyPerToken };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tokenCount: 30, moneyPerToken: 0.25 },
  output: { cashValue: 7.5 },
} satisfies ToolExample<Input, Output>;
export const experimentBudgetTokenExchangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/experiment-budget-token-exchange",
    title: "Experiment Budget Token Exchange",
    description:
      "Convert supplied experimental tokens to money using an explicit nonnegative exchange rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokenCount: { type: "integer", minimum: 0 },
        moneyPerToken: { type: "number", minimum: 0 },
      },
      required: ["tokenCount", "moneyPerToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cashValue: { type: "number" } },
      required: ["cashValue"],
    },
    ports: {
      inputs: [
        {
          id: "tokenCount",
          label: "Token Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "moneyPerToken",
          label: "Money Per Token",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cashValue", label: "Cash Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = experimentBudgetTokenExchangeTool.execute;
export default experimentBudgetTokenExchangeTool;
