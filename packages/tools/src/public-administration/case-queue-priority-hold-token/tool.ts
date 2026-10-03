import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priority: number;
  readonly held: boolean;
  readonly releaseAt: number;
  readonly queryAt: number;
};
export type Output = { readonly eligible: boolean; readonly priority: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priority: { type: "number" },
    held: { type: "boolean" },
    releaseAt: { type: "number" },
    queryAt: { type: "number" },
  },
  required: ["priority", "held", "releaseAt", "queryAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligible: { type: "boolean" }, priority: { type: "number" } },
  required: ["eligible", "priority"],
} as const;
/** Retain a supplied queue priority while checking an explicit hold-release boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priority, held, releaseAt, queryAt } = request;
  const compute = (): Output => {
    return { eligible: !held || queryAt >= releaseAt, priority };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priority: 5, held: true, releaseAt: 100, queryAt: 90 },
  output: { eligible: false, priority: 5 },
} satisfies ToolExample<Input, Output>;
export const caseQueuePriorityHoldTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/case-queue-priority-hold-token",
    title: "Case Queue Priority Hold Token Tool",
    description:
      "Retain a supplied queue priority while checking an explicit hold-release boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priority: { type: "number" },
        held: { type: "boolean" },
        releaseAt: { type: "number" },
        queryAt: { type: "number" },
      },
      required: ["priority", "held", "releaseAt", "queryAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "boolean" },
        priority: { type: "number" },
      },
      required: ["eligible", "priority"],
    },
    ports: {
      inputs: [
        {
          id: "priority",
          label: "Priority",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "held",
          label: "Held",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "releaseAt",
          label: "Release At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "queryAt",
          label: "Query At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "eligible", label: "Eligible", valueType: { type: "boolean" } },
        { id: "priority", label: "Priority", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = caseQueuePriorityHoldTokenTool.execute;
export default caseQueuePriorityHoldTokenTool;
