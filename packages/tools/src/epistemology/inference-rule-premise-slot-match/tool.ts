import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedPremiseId: string;
  readonly expectedPremiseId: string;
};
export type Output = { readonly matchesSlot: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedPremiseId: { type: "string", maxLength: 8192, minLength: 1 },
    expectedPremiseId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["suppliedPremiseId", "expectedPremiseId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matchesSlot: { type: "boolean" } },
  required: ["matchesSlot"],
} as const;
/** Compare exact supplied premise identifiers for one explicit inference-rule slot without validating an argument. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedPremiseId, expectedPremiseId } = request;
  const compute = (): Output => {
    H.domain(suppliedPremiseId.length > 0, "suppliedPremiseId");
    H.domain(expectedPremiseId.length > 0, "expectedPremiseId");
    return { matchesSlot: suppliedPremiseId === expectedPremiseId };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedPremiseId: "P17", expectedPremiseId: "P17" },
  output: { matchesSlot: true },
} satisfies ToolExample<Input, Output>;
export const inferenceRulePremiseSlotMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/inference-rule-premise-slot-match",
    title: "Inference Rule Premise Slot Match Tool",
    description:
      "Compare exact supplied premise identifiers for one explicit inference-rule slot without validating an argument.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedPremiseId: { type: "string", maxLength: 8192, minLength: 1 },
        expectedPremiseId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["suppliedPremiseId", "expectedPremiseId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matchesSlot: { type: "boolean" } },
      required: ["matchesSlot"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedPremiseId",
          label: "Supplied Premise Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedPremiseId",
          label: "Expected Premise Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "matchesSlot",
          label: "Matches Slot",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = inferenceRulePremiseSlotMatchTool.execute;
export default inferenceRulePremiseSlotMatchTool;
