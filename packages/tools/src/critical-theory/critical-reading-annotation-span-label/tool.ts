import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly startOffset: number;
  readonly endOffsetExclusive: number;
  readonly annotationCode: string;
};
export type Output = { readonly label: string; readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    startOffset: { type: "integer", minimum: 0 },
    endOffsetExclusive: { type: "integer" },
    annotationCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "documentId",
    "startOffset",
    "endOffsetExclusive",
    "annotationCode",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    length: { type: "integer" },
  },
  required: ["label", "length"],
} as const;
/** Label an explicit half-open critical-reading annotation span without choosing a tokenizer or interpreting a passage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, startOffset, endOffsetExclusive, annotationCode } =
    request;
  const compute = (): Output => {
    H.domain(documentId.length > 0 && annotationCode.length > 0, "documentId");
    (H.domain(
      Number.isSafeInteger(startOffset) &&
        startOffset >= 0 &&
        startOffset <= Number.MAX_SAFE_INTEGER,
      "startOffset",
    ),
      startOffset);
    (H.domain(
      Number.isSafeInteger(endOffsetExclusive) &&
        endOffsetExclusive >= startOffset &&
        endOffsetExclusive <= Number.MAX_SAFE_INTEGER,
      "endOffsetExclusive",
    ),
      endOffsetExclusive);
    return {
      label:
        documentId +
        "[" +
        startOffset +
        "," +
        endOffsetExclusive +
        "):" +
        annotationCode,
      length: endOffsetExclusive - startOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    documentId: "D17",
    startOffset: 10,
    endOffsetExclusive: 20,
    annotationCode: "A3",
  },
  output: { label: "D17[10,20):A3", length: 10 },
} satisfies ToolExample<Input, Output>;
export const criticalReadingAnnotationSpanLabelTool = H.defineSchemaCalculation<
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
    id: "critical-theory/critical-reading-annotation-span-label",
    title: "Critical Reading Annotation Span Label",
    description:
      "Label an explicit half-open critical-reading annotation span without choosing a tokenizer or interpreting a passage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        startOffset: { type: "integer", minimum: 0 },
        endOffsetExclusive: { type: "integer" },
        annotationCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "documentId",
        "startOffset",
        "endOffsetExclusive",
        "annotationCode",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        length: { type: "integer" },
      },
      required: ["label", "length"],
    },
    ports: {
      inputs: [
        {
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "startOffset",
          label: "Start Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endOffsetExclusive",
          label: "End Offset Exclusive",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "annotationCode",
          label: "Annotation Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "length", label: "Length", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = criticalReadingAnnotationSpanLabelTool.execute;
export default criticalReadingAnnotationSpanLabelTool;
