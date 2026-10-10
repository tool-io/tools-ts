import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotationId: string;
  readonly sourceId: string;
  readonly contextWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotationId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    contextWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["quotationId", "sourceId", "contextWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Attach supplied source and context wording to a quotation without generating or interpreting its content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotationId, sourceId, contextWording } = request;
  const compute = (): Output => {
    H.domain(quotationId.length > 0, "quotationId");
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(contextWording.length > 0, "contextWording");
    return { token: JSON.stringify([quotationId, sourceId, contextWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quotationId: "Q17",
    sourceId: "REPORT2",
    contextWording: "discussion",
  },
  output: { token: '["Q17","REPORT2","discussion"]' },
} satisfies ToolExample<Input, Output>;
export const osteopathyQuotationContextTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["osteopathy", "health and medicine"],
      keywords: ["osteopathy", "health and medicine"],
    },
    id: "osteopathy/osteopathy-quotation-context-tag",
    title: "Osteopathy Quotation Context Tag",
    description:
      "Attach supplied source and context wording to a quotation without generating or interpreting its content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotationId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        contextWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["quotationId", "sourceId", "contextWording"],
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
          id: "quotationId",
          label: "Quotation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "contextWording",
          label: "Context Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = osteopathyQuotationContextTagTool.execute;
export default osteopathyQuotationContextTagTool;
