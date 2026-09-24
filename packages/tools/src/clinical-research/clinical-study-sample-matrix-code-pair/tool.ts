import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordCode: string;
  readonly labelCode: string;
  readonly vocabulary: readonly string[];
  readonly expectedCode: string;
};
export type Output = {
  readonly recordKnown: boolean;
  readonly labelKnown: boolean;
  readonly pairMatches: boolean;
  readonly expectedMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordCode: { type: "string", maxLength: 8192 },
    labelCode: { type: "string", maxLength: 8192 },
    vocabulary: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    expectedCode: { type: "string", maxLength: 8192 },
  },
  required: ["recordCode", "labelCode", "vocabulary", "expectedCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordKnown: { type: "boolean" },
    labelKnown: { type: "boolean" },
    pairMatches: { type: "boolean" },
    expectedMatches: { type: "boolean" },
  },
  required: ["recordKnown", "labelKnown", "pairMatches", "expectedMatches"],
} as const;
/** Compare supplied sample-matrix codes under an explicit vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordCode, labelCode, vocabulary, expectedCode } = request;
  const compute = (): Output => {
    return {
      recordKnown: vocabulary.includes(recordCode),
      labelKnown: vocabulary.includes(labelCode),
      pairMatches: recordCode === labelCode,
      expectedMatches:
        recordCode === expectedCode && labelCode === expectedCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordCode: "A",
    labelCode: "A",
    vocabulary: ["A", "B"],
    expectedCode: "A",
  },
  output: {
    recordKnown: true,
    labelKnown: true,
    pairMatches: true,
    expectedMatches: true,
  },
} satisfies ToolExample<Input, Output>;
export const clinicalStudySampleMatrixCodePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/clinical-study-sample-matrix-code-pair",
    title: "Clinical Study Sample Matrix Code Pair Tool",
    description:
      "Compare supplied sample-matrix codes under an explicit vocabulary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordCode: { type: "string", maxLength: 8192 },
        labelCode: { type: "string", maxLength: 8192 },
        vocabulary: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        expectedCode: { type: "string", maxLength: 8192 },
      },
      required: ["recordCode", "labelCode", "vocabulary", "expectedCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordKnown: { type: "boolean" },
        labelKnown: { type: "boolean" },
        pairMatches: { type: "boolean" },
        expectedMatches: { type: "boolean" },
      },
      required: ["recordKnown", "labelKnown", "pairMatches", "expectedMatches"],
    },
    ports: {
      inputs: [
        {
          id: "recordCode",
          label: "Record Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelCode",
          label: "Label Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vocabulary",
          label: "Vocabulary",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "expectedCode",
          label: "Expected Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recordKnown",
          label: "Record Known",
          valueType: { type: "boolean" },
        },
        {
          id: "labelKnown",
          label: "Label Known",
          valueType: { type: "boolean" },
        },
        {
          id: "pairMatches",
          label: "Pair Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "expectedMatches",
          label: "Expected Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = clinicalStudySampleMatrixCodePairTool.execute;
export default clinicalStudySampleMatrixCodePairTool;
