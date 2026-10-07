import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presented: boolean;
  readonly completed: boolean;
  readonly declined: boolean;
};
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presented: { type: "boolean" },
    completed: { type: "boolean" },
    declined: { type: "boolean" },
  },
  required: ["presented", "completed", "declined"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Encode explicit task presentation, completion and decline flags without converting a declined task into a failed assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presented, completed, declined } = request;
  const compute = (): Output => {
    H.domain(!(completed && declined), "completed");
    H.domain(presented || (!completed && !declined), "presented");
    return {
      code: !presented
        ? "not-presented"
        : completed
          ? "completed"
          : declined
            ? "declined"
            : "incomplete",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presented: true, completed: false, declined: true },
  output: { code: "declined" },
} satisfies ToolExample<Input, Output>;
export const developmentalTaskCompletionCodeTool = H.defineSchemaCalculation<
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
    id: "child-development/developmental-task-completion-code",
    title: "Developmental Task Completion Code",
    description:
      "Encode explicit task presentation, completion and decline flags without converting a declined task into a failed assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presented: { type: "boolean" },
        completed: { type: "boolean" },
        declined: { type: "boolean" },
      },
      required: ["presented", "completed", "declined"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { code: { type: "string", maxLength: 8192 } },
      required: ["code"],
    },
    ports: {
      inputs: [
        {
          id: "presented",
          label: "Presented",
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
          id: "declined",
          label: "Declined",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = developmentalTaskCompletionCodeTool.execute;
export default developmentalTaskCompletionCodeTool;
