import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startOffset: number;
  readonly endOffset: number;
};
export type Output = { readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startOffset: { type: "integer", minimum: 0 },
    endOffset: { type: "integer" },
  },
  required: ["startOffset", "endOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "integer" } },
  required: ["length"],
} as const;
/** Calculate one explicit half-open case-document redaction span length without performing redaction or asserting confidentiality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startOffset, endOffset } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startOffset) &&
        startOffset >= 0 &&
        startOffset <= Number.MAX_SAFE_INTEGER,
      "startOffset",
    ),
      startOffset);
    (H.domain(
      Number.isSafeInteger(endOffset) &&
        endOffset >= startOffset &&
        endOffset <= Number.MAX_SAFE_INTEGER,
      "endOffset",
    ),
      endOffset);
    return { length: endOffset - startOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startOffset: 10, endOffset: 25 },
  output: { length: 15 },
} satisfies ToolExample<Input, Output>;
export const caseDocumentRedactionSpanLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/case-document-redaction-span-length",
    title: "Case Document Redaction Span Length",
    description:
      "Calculate one explicit half-open case-document redaction span length without performing redaction or asserting confidentiality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startOffset: { type: "integer", minimum: 0 },
        endOffset: { type: "integer" },
      },
      required: ["startOffset", "endOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { length: { type: "integer" } },
      required: ["length"],
    },
    ports: {
      inputs: [
        {
          id: "startOffset",
          label: "Start Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endOffset",
          label: "End Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "length", label: "Length", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = caseDocumentRedactionSpanLengthTool.execute;
export default caseDocumentRedactionSpanLengthTool;
