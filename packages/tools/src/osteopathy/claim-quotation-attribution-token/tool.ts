import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quote: string;
  readonly attributedSource: string;
  readonly sourceKnown: boolean;
};
export type Output = {
  readonly attributionComplete: boolean;
  readonly quotedText: string;
  readonly source: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quote: { type: "string", maxLength: 8192 },
    attributedSource: { type: "string", maxLength: 8192 },
    sourceKnown: { type: "boolean" },
  },
  required: ["quote", "attributedSource", "sourceKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attributionComplete: { type: "boolean" },
    quotedText: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["attributionComplete", "quotedText", "source"],
} as const;
/** Preserve quotation and source annotations without endorsing the quoted claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quote, attributedSource, sourceKnown } = request;
  const compute = (): Output => {
    return {
      attributionComplete: sourceKnown && attributedSource.trim().length > 0,
      quotedText: quote,
      source: attributedSource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quote: "reported claim",
    attributedSource: "paper-A",
    sourceKnown: true,
  },
  output: {
    attributionComplete: true,
    quotedText: "reported claim",
    source: "paper-A",
  },
} satisfies ToolExample<Input, Output>;
export const claimQuotationAttributionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/claim-quotation-attribution-token",
    title: "Claim Quotation Attribution Token Tool",
    description:
      "Preserve quotation and source annotations without endorsing the quoted claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quote: { type: "string", maxLength: 8192 },
        attributedSource: { type: "string", maxLength: 8192 },
        sourceKnown: { type: "boolean" },
      },
      required: ["quote", "attributedSource", "sourceKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attributionComplete: { type: "boolean" },
        quotedText: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["attributionComplete", "quotedText", "source"],
    },
    ports: {
      inputs: [
        {
          id: "quote",
          label: "Quote",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "attributedSource",
          label: "Attributed Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceKnown",
          label: "Source Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "attributionComplete",
          label: "Attribution Complete",
          valueType: { type: "boolean" },
        },
        {
          id: "quotedText",
          label: "Quoted Text",
          valueType: { type: "string" },
        },
        { id: "source", label: "Source", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = claimQuotationAttributionTokenTool.execute;
export default claimQuotationAttributionTokenTool;
