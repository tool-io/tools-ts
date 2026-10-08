import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly before: string;
  readonly insertion: string;
  readonly after: string;
};
export type Output = { readonly quotation: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "string", maxLength: 8192 },
    insertion: { type: "string", maxLength: 8192, minLength: 1 },
    after: { type: "string", maxLength: 8192 },
  },
  required: ["before", "insertion", "after"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quotation: { type: "string", maxLength: 8192 } },
  required: ["quotation"],
} as const;
/** Mark an explicit editorial insertion with square brackets between literal quotation fragments without changing the supplied source text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { before, insertion, after } = request;
  const compute = (): Output => {
    H.domain(insertion.length > 0 && !/[\[\]]/.test(insertion), "insertion");
    return { quotation: before + "[" + insertion + "]" + after };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { before: "The ", insertion: "editorial word", after: " follows" },
  output: { quotation: "The [editorial word] follows" },
} satisfies ToolExample<Input, Output>;
export const quotationEditorialInsertionMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/quotation-editorial-insertion-marker",
    title: "Quotation Editorial Insertion Marker",
    description:
      "Mark an explicit editorial insertion with square brackets between literal quotation fragments without changing the supplied source text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "string", maxLength: 8192 },
        insertion: { type: "string", maxLength: 8192, minLength: 1 },
        after: { type: "string", maxLength: 8192 },
      },
      required: ["before", "insertion", "after"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { quotation: { type: "string", maxLength: 8192 } },
      required: ["quotation"],
    },
    ports: {
      inputs: [
        {
          id: "before",
          label: "Before",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "insertion",
          label: "Insertion",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "after",
          label: "After",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "quotation", label: "Quotation", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = quotationEditorialInsertionMarkerTool.execute;
export default quotationEditorialInsertionMarkerTool;
