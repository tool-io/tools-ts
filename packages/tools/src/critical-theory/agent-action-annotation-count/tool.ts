import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly agents: readonly string[];
  readonly actions: readonly string[];
  readonly requestedAgent: string;
};
export type Output = {
  readonly count: number;
  readonly distinctActions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agents: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    actions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedAgent: { type: "string", maxLength: 8192 },
  },
  required: ["agents", "actions", "requestedAgent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer" },
    distinctActions: { type: "integer" },
  },
  required: ["count", "distinctActions"],
} as const;
/** Calculate agent action annotation count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { agents, actions, requestedAgent } = request;
  const compute = (): Output => {
    H.sameLength(agents, actions);
    return {
      count: agents.filter((x) => x === requestedAgent).length,
      distinctActions: new Set(
        actions.filter((x, i) => agents[i] === requestedAgent),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    agents: ["A", "B", "A"],
    actions: ["speak", "read", "speak"],
    requestedAgent: "A",
  },
  output: { count: 2, distinctActions: 1 },
} satisfies ToolExample<Input, Output>;
export const agentActionAnnotationCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/agent-action-annotation-count",
    title: "Agent Action Annotation Count Tool",
    description:
      "Calculate agent action annotation count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        agents: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        actions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedAgent: { type: "string", maxLength: 8192 },
      },
      required: ["agents", "actions", "requestedAgent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer" },
        distinctActions: { type: "integer" },
      },
      required: ["count", "distinctActions"],
    },
    ports: {
      inputs: [
        {
          id: "agents",
          label: "Agents",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "actions",
          label: "Actions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedAgent",
          label: "Requested Agent",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
        {
          id: "distinctActions",
          label: "Distinct Actions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = agentActionAnnotationCountTool.execute;
export default agentActionAnnotationCountTool;
