import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotation: string;
  readonly creator: string;
  readonly sourceTitle: string;
  readonly locator: string;
};
export type Output = { readonly attribution: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotation: { type: "string", maxLength: 8192 },
    creator: { type: "string", maxLength: 8192 },
    sourceTitle: { type: "string", maxLength: 8192 },
    locator: { type: "string", maxLength: 8192 },
  },
  required: ["quotation", "creator", "sourceTitle", "locator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { attribution: { type: "string", maxLength: 8192 } },
  required: ["attribution"],
} as const;
/** Format a literal quotation with explicitly supplied creator, source and locator fields; attribution accuracy is not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotation, creator, sourceTitle, locator } = request;
  const compute = (): Output => {
    H.domain(
      quotation.length > 0 &&
        creator.length > 0 &&
        sourceTitle.length > 0 &&
        locator.length > 0,
      "quotation",
    );
    return {
      attribution:
        JSON.stringify(quotation) +
        " — " +
        creator +
        ", " +
        sourceTitle +
        ", " +
        locator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quotation: "A brief phrase",
    creator: "A. Example",
    sourceTitle: "Collected Essays",
    locator: "p. 12",
  },
  output: {
    attribution: '"A brief phrase" — A. Example, Collected Essays, p. 12',
  },
} satisfies ToolExample<Input, Output>;
export const culturalSourceQuotationAttributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/cultural-source-quotation-attribution",
    title: "Cultural Source Quotation Attribution Tool",
    description:
      "Format a literal quotation with explicitly supplied creator, source and locator fields; attribution accuracy is not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotation: { type: "string", maxLength: 8192 },
        creator: { type: "string", maxLength: 8192 },
        sourceTitle: { type: "string", maxLength: 8192 },
        locator: { type: "string", maxLength: 8192 },
      },
      required: ["quotation", "creator", "sourceTitle", "locator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { attribution: { type: "string", maxLength: 8192 } },
      required: ["attribution"],
    },
    ports: {
      inputs: [
        {
          id: "quotation",
          label: "Quotation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "creator",
          label: "Creator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceTitle",
          label: "Source Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "locator",
          label: "Locator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "attribution",
          label: "Attribution",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = culturalSourceQuotationAttributionTool.execute;
export default culturalSourceQuotationAttributionTool;
