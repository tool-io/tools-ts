import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly observed: boolean; readonly completed: boolean };
export type Output = {
  readonly status: string;
  readonly completionKnown: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { observed: { type: "boolean" }, completed: { type: "boolean" } },
  required: ["observed", "completed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: { type: "string", maxLength: 8192 },
    completionKnown: { type: "boolean" },
  },
  required: ["status", "completionKnown"],
} as const;
/** Preserve an observation-state flag without treating an unobserved research task as failure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, completed } = request;
  const compute = (): Output => {
    return {
      status: !observed
        ? "unobserved"
        : completed
          ? "completed"
          : "not-completed",
      completionKnown: observed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: false, completed: false },
  output: { status: "unobserved", completionKnown: false },
} satisfies ToolExample<Input, Output>;
export const childTaskUnobservedStateTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/child-task-unobserved-state-token",
    title: "Child Task Unobserved State Token Tool",
    description:
      "Preserve an observation-state flag without treating an unobserved research task as failure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "boolean" },
        completed: { type: "boolean" },
      },
      required: ["observed", "completed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", maxLength: 8192 },
        completionKnown: { type: "boolean" },
      },
      required: ["status", "completionKnown"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
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
        { id: "status", label: "Status", valueType: { type: "string" } },
        {
          id: "completionKnown",
          label: "Completion Known",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = childTaskUnobservedStateTokenTool.execute;
export default childTaskUnobservedStateTokenTool;
