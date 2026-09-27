import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claim: string;
  readonly hypothesis: string;
  readonly source: string;
  readonly expectedHypothesis: string;
};
export type Output = { readonly sameScope: boolean; readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claim: { type: "string", maxLength: 8192 },
    hypothesis: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    expectedHypothesis: { type: "string", maxLength: 8192 },
  },
  required: ["claim", "hypothesis", "source", "expectedHypothesis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameScope: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["sameScope", "key"],
} as const;
/** Retain an explicitly annotated hypothesis scope rather than inferring a belief or evidence relation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claim, hypothesis, source, expectedHypothesis } = request;
  const compute = (): Output => {
    return {
      sameScope: hypothesis === expectedHypothesis,
      key: JSON.stringify([source, hypothesis, claim]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claim: "claim-A",
    hypothesis: "H1",
    source: "source-A",
    expectedHypothesis: "H1",
  },
  output: { sameScope: true, key: '["source-A","H1","claim-A"]' },
} satisfies ToolExample<Input, Output>;
export const beliefScopeHypothesisTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/belief-scope-hypothesis-token",
    title: "Belief Scope Hypothesis Token Tool",
    description:
      "Retain an explicitly annotated hypothesis scope rather than inferring a belief or evidence relation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claim: { type: "string", maxLength: 8192 },
        hypothesis: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        expectedHypothesis: { type: "string", maxLength: 8192 },
      },
      required: ["claim", "hypothesis", "source", "expectedHypothesis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameScope: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["sameScope", "key"],
    },
    ports: {
      inputs: [
        {
          id: "claim",
          label: "Claim",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "hypothesis",
          label: "Hypothesis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedHypothesis",
          label: "Expected Hypothesis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sameScope",
          label: "Same Scope",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = beliefScopeHypothesisTokenTool.execute;
export default beliefScopeHypothesisTokenTool;
