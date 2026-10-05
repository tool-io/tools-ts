import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly required: boolean; readonly completed: boolean };
export type Output = { readonly outstandingRequiredTask: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { required: { type: "boolean" }, completed: { type: "boolean" } },
  required: ["required", "completed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outstandingRequiredTask: { type: "boolean" } },
  required: ["outstandingRequiredTask"],
} as const;
/** Flag an explicitly required support task as outstanding when not recorded complete. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { required, completed } = request;
  const compute = (): Output => {
    return { outstandingRequiredTask: required && !completed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { required: true, completed: false },
  output: { outstandingRequiredTask: true },
} satisfies ToolExample<Input, Output>;
export const supportTaskCompletionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/support-task-completion-flag",
    title: "Support Task Completion Flag Tool",
    description:
      "Flag an explicitly required support task as outstanding when not recorded complete.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "boolean" },
        completed: { type: "boolean" },
      },
      required: ["required", "completed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { outstandingRequiredTask: { type: "boolean" } },
      required: ["outstandingRequiredTask"],
    },
    ports: {
      inputs: [
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "outstandingRequiredTask",
          label: "Outstanding Required Task",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = supportTaskCompletionFlagTool.execute;
export default supportTaskCompletionFlagTool;
