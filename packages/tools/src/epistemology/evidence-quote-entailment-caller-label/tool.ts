import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimId: string;
  readonly quotationId: string;
  readonly suppliedRelation: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimId: { type: "string", maxLength: 8192, minLength: 1 },
    quotationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRelation: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["claimId", "quotationId", "suppliedRelation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied evidence-quotation relation without performing semantic entailment or fact verification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimId, quotationId, suppliedRelation } = request;
  const compute = (): Output => {
    H.domain(claimId.length > 0, "claimId");
    H.domain(quotationId.length > 0, "quotationId");
    H.domain(suppliedRelation.length > 0, "suppliedRelation");
    return { token: JSON.stringify([claimId, quotationId, suppliedRelation]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimId: "C17", quotationId: "Q4", suppliedRelation: "supports" },
  output: { token: '["C17","Q4","supports"]' },
} satisfies ToolExample<Input, Output>;
export const evidenceQuoteEntailmentCallerLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/evidence-quote-entailment-caller-label",
    title: "Evidence Quote Entailment Caller Label Tool",
    description:
      "Preserve an explicitly supplied evidence-quotation relation without performing semantic entailment or fact verification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimId: { type: "string", maxLength: 8192, minLength: 1 },
        quotationId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedRelation: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["claimId", "quotationId", "suppliedRelation"],
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
          id: "claimId",
          label: "Claim Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "quotationId",
          label: "Quotation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRelation",
          label: "Supplied Relation",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = evidenceQuoteEntailmentCallerLabelTool.execute;
export default evidenceQuoteEntailmentCallerLabelTool;
