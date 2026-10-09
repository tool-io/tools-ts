import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beliefId: string;
  readonly priorityText: string;
  readonly orderingSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beliefId: { type: "string", maxLength: 8192, minLength: 1 },
    priorityText: { type: "string", maxLength: 8192, minLength: 1 },
    orderingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["beliefId", "priorityText", "orderingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit belief-revision priority and ordering source without selecting an epistemic entrenchment relation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beliefId, priorityText, orderingSource } = request;
  const compute = (): Output => {
    H.domain(beliefId.length > 0, "beliefId");
    H.domain(priorityText.length > 0, "priorityText");
    H.domain(orderingSource.length > 0, "orderingSource");
    return { token: JSON.stringify([beliefId, priorityText, orderingSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beliefId: "B17",
    priorityText: "high",
    orderingSource: "ordering O4",
  },
  output: { token: '["B17","high","ordering O4"]' },
} satisfies ToolExample<Input, Output>;
export const beliefRevisionExplicitPriorityTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/belief-revision-explicit-priority-tag",
    title: "Belief Revision Explicit Priority Tag Tool",
    description:
      "Record an explicit belief-revision priority and ordering source without selecting an epistemic entrenchment relation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beliefId: { type: "string", maxLength: 8192, minLength: 1 },
        priorityText: { type: "string", maxLength: 8192, minLength: 1 },
        orderingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["beliefId", "priorityText", "orderingSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "beliefId",
          label: "Belief Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "priorityText",
          label: "Priority Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "orderingSource",
          label: "Ordering Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = beliefRevisionExplicitPriorityTagTool.execute;
export default beliefRevisionExplicitPriorityTagTool;
