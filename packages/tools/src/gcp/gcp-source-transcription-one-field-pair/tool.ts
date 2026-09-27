import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceValue: string;
  readonly transcribedValue: string;
  readonly trimSpaces: boolean;
  readonly caseSensitive: boolean;
};
export type Output = {
  readonly exactMatch: boolean;
  readonly normalizedMatch: boolean;
  readonly sourceNormalized: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceValue: { type: "string", maxLength: 8192 },
    transcribedValue: { type: "string", maxLength: 8192 },
    trimSpaces: { type: "boolean" },
    caseSensitive: { type: "boolean" },
  },
  required: ["sourceValue", "transcribedValue", "trimSpaces", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exactMatch: { type: "boolean" },
    normalizedMatch: { type: "boolean" },
    sourceNormalized: { type: "string", maxLength: 8192 },
  },
  required: ["exactMatch", "normalizedMatch", "sourceNormalized"],
} as const;
/** Compare one supplied source/transcription string under an explicit normalization policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceValue, transcribedValue, trimSpaces, caseSensitive } = request;
  const compute = (): Output => {
    const normalize = (x: string) => {
      const a = trimSpaces ? x.replace(/^ +| +$/g, "") : x;
      return caseSensitive ? a : a.toLowerCase();
    };
    return {
      exactMatch: sourceValue === transcribedValue,
      normalizedMatch: normalize(sourceValue) === normalize(transcribedValue),
      sourceNormalized: normalize(sourceValue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceValue: " ABC ",
    transcribedValue: "abc",
    trimSpaces: true,
    caseSensitive: false,
  },
  output: { exactMatch: false, normalizedMatch: true, sourceNormalized: "abc" },
} satisfies ToolExample<Input, Output>;
export const gcpSourceTranscriptionOneFieldPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-source-transcription-one-field-pair",
    title: "GCP Source Transcription One Field Pair Tool",
    description:
      "Compare one supplied source/transcription string under an explicit normalization policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceValue: { type: "string", maxLength: 8192 },
        transcribedValue: { type: "string", maxLength: 8192 },
        trimSpaces: { type: "boolean" },
        caseSensitive: { type: "boolean" },
      },
      required: [
        "sourceValue",
        "transcribedValue",
        "trimSpaces",
        "caseSensitive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exactMatch: { type: "boolean" },
        normalizedMatch: { type: "boolean" },
        sourceNormalized: { type: "string", maxLength: 8192 },
      },
      required: ["exactMatch", "normalizedMatch", "sourceNormalized"],
    },
    ports: {
      inputs: [
        {
          id: "sourceValue",
          label: "Source Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "transcribedValue",
          label: "Transcribed Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trimSpaces",
          label: "Trim Spaces",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "exactMatch",
          label: "Exact Match",
          valueType: { type: "boolean" },
        },
        {
          id: "normalizedMatch",
          label: "Normalized Match",
          valueType: { type: "boolean" },
        },
        {
          id: "sourceNormalized",
          label: "Source Normalized",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpSourceTranscriptionOneFieldPairTool.execute;
export default gcpSourceTranscriptionOneFieldPairTool;
