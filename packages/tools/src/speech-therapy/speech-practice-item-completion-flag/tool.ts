import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly attempted: boolean;
  readonly completed: boolean;
  readonly excluded: boolean;
};
export type Output = { readonly countedComplete: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    attempted: { type: "boolean" },
    completed: { type: "boolean" },
    excluded: { type: "boolean" },
  },
  required: ["itemId", "attempted", "completed", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { countedComplete: { type: "boolean" } },
  required: ["countedComplete"],
} as const;
/** Combine explicit speech-practice completion and exclusion flags without evaluating performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, attempted, completed, excluded } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0, "itemId");
    H.domain(attempted || !completed, "completed");
    return { countedComplete: attempted && completed && !excluded };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemId: "Q17", attempted: true, completed: true, excluded: false },
  output: { countedComplete: true },
} satisfies ToolExample<Input, Output>;
export const speechPracticeItemCompletionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["speech-therapy", "speech therapy", "health and medicine"],
      keywords: ["speech therapy", "health and medicine"],
    },
    id: "speech-therapy/speech-practice-item-completion-flag",
    title: "Speech Practice Item Completion Flag",
    description:
      "Combine explicit speech-practice completion and exclusion flags without evaluating performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        attempted: { type: "boolean" },
        completed: { type: "boolean" },
        excluded: { type: "boolean" },
      },
      required: ["itemId", "attempted", "completed", "excluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { countedComplete: { type: "boolean" } },
      required: ["countedComplete"],
    },
    ports: {
      inputs: [
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "attempted",
          label: "Attempted",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedComplete",
          label: "Counted Complete",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = speechPracticeItemCompletionFlagTool.execute;
export default speechPracticeItemCompletionFlagTool;
