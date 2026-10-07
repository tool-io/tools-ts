import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly taskId: string; readonly promptCount: number };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskId: { type: "string", maxLength: 8192, minLength: 1 },
    promptCount: { type: "integer", minimum: 0 },
  },
  required: ["taskId", "promptCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly counted task prompt total without interpreting developmental ability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskId, promptCount } = request;
  const compute = (): Output => {
    H.domain(taskId.length > 0, "taskId");
    (H.domain(
      Number.isSafeInteger(promptCount) &&
        promptCount >= 0 &&
        promptCount <= Number.MAX_SAFE_INTEGER,
      "promptCount",
    ),
      promptCount);
    return { label: taskId + "; recorded prompts=" + promptCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskId: "T17", promptCount: 3 },
  output: { label: "T17; recorded prompts=3" },
} satisfies ToolExample<Input, Output>;
export const childTaskPromptCountLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/child-task-prompt-count-label",
    title: "Child Task Prompt Count Label",
    description:
      "Label an explicitly counted task prompt total without interpreting developmental ability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskId: { type: "string", maxLength: 8192, minLength: 1 },
        promptCount: { type: "integer", minimum: 0 },
      },
      required: ["taskId", "promptCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "taskId",
          label: "Task Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "promptCount",
          label: "Prompt Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = childTaskPromptCountLabelTool.execute;
export default childTaskPromptCountLabelTool;
