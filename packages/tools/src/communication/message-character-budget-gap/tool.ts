import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly message: string;
  readonly limit: number;
  readonly countCodePoints: boolean;
};
export type Output = { readonly used: number; readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    message: { type: "string", maxLength: 8192 },
    limit: { type: "integer", minimum: 0 },
    countCodePoints: { type: "boolean" },
  },
  required: ["message", "limit", "countCodePoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { used: { type: "integer" }, remaining: { type: "integer" } },
  required: ["used", "remaining"],
} as const;
/** Compare a message to an explicit code-point or UTF-16-unit budget. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { message, limit, countCodePoints } = request;
  const compute = (): Output => {
    H.integer(limit, 0);
    return {
      used: countCodePoints ? [...message].length : message.length,
      remaining:
        limit - (countCodePoints ? [...message].length : message.length),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { message: "A🚀", limit: 4, countCodePoints: true },
  output: { used: 2, remaining: 2 },
} satisfies ToolExample<Input, Output>;
export const messageCharacterBudgetGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/message-character-budget-gap",
    title: "Message Character Budget Gap Tool",
    description:
      "Compare a message to an explicit code-point or UTF-16-unit budget.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        message: { type: "string", maxLength: 8192 },
        limit: { type: "integer", minimum: 0 },
        countCodePoints: { type: "boolean" },
      },
      required: ["message", "limit", "countCodePoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { used: { type: "integer" }, remaining: { type: "integer" } },
      required: ["used", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "message",
          label: "Message",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countCodePoints",
          label: "Count Code Points",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "used", label: "Used", valueType: { type: "integer" } },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = messageCharacterBudgetGapTool.execute;
export default messageCharacterBudgetGapTool;
