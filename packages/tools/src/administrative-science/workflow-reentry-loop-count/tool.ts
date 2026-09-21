import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly stateTokens: readonly string[] };
export type Output = {
  readonly reentries: number;
  readonly distinctStates: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stateTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["stateTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reentries: { type: "integer" },
    distinctStates: { type: "integer" },
  },
  required: ["reentries", "distinctStates"],
} as const;
/** Count returns to a previously visited state after a different state, ignoring consecutive repeats. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stateTokens } = request;
  const compute = (): Output => {
    const seen = new Set<string>();
    let reentries = 0;
    for (let i = 0; i < stateTokens.length; i++) {
      const x = stateTokens[i];
      if (seen.has(x) && x !== stateTokens[i - 1]) reentries++;
      seen.add(x);
    }
    return { reentries, distinctStates: seen.size };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stateTokens: ["A", "B", "A", "A", "B"] },
  output: { reentries: 2, distinctStates: 2 },
} satisfies ToolExample<Input, Output>;
export const workflowReentryLoopCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/workflow-reentry-loop-count",
    title: "Workflow Reentry Loop Count Tool",
    description:
      "Count returns to a previously visited state after a different state, ignoring consecutive repeats.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stateTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["stateTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reentries: { type: "integer" },
        distinctStates: { type: "integer" },
      },
      required: ["reentries", "distinctStates"],
    },
    ports: {
      inputs: [
        {
          id: "stateTokens",
          label: "State Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "reentries", label: "Reentries", valueType: { type: "integer" } },
        {
          id: "distinctStates",
          label: "Distinct States",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = workflowReentryLoopCountTool.execute;
export default workflowReentryLoopCountTool;
