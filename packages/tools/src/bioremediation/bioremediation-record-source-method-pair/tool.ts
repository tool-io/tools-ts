import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly method: string;
  readonly expectedMethod: string;
  readonly source: string;
  readonly expectedSource: string;
  readonly edition: string;
};
export type Output = {
  readonly methodMatches: boolean;
  readonly sourceMatches: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    method: { type: "string", maxLength: 8192 },
    expectedMethod: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    expectedSource: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: ["method", "expectedMethod", "source", "expectedSource", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    methodMatches: { type: "boolean" },
    sourceMatches: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["methodMatches", "sourceMatches", "key"],
} as const;
/** Compare supplied assay source/method attribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { method, expectedMethod, source, expectedSource, edition } = request;
  const compute = (): Output => {
    return {
      methodMatches: method === expectedMethod,
      sourceMatches: source === expectedSource,
      key: JSON.stringify([source, edition, method]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    method: "M1",
    expectedMethod: "M1",
    source: "lab-A",
    expectedSource: "lab-A",
    edition: "v2",
  },
  output: {
    methodMatches: true,
    sourceMatches: true,
    key: '["lab-A","v2","M1"]',
  },
} satisfies ToolExample<Input, Output>;
export const bioremediationRecordSourceMethodPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioremediation/bioremediation-record-source-method-pair",
      title: "Bioremediation Record Source Method Pair Tool",
      description: "Compare supplied assay source/method attribution.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          method: { type: "string", maxLength: 8192 },
          expectedMethod: { type: "string", maxLength: 8192 },
          source: { type: "string", maxLength: 8192 },
          expectedSource: { type: "string", maxLength: 8192 },
          edition: { type: "string", maxLength: 8192 },
        },
        required: [
          "method",
          "expectedMethod",
          "source",
          "expectedSource",
          "edition",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          methodMatches: { type: "boolean" },
          sourceMatches: { type: "boolean" },
          key: { type: "string", maxLength: 8192 },
        },
        required: ["methodMatches", "sourceMatches", "key"],
      },
      ports: {
        inputs: [
          {
            id: "method",
            label: "Method",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedMethod",
            label: "Expected Method",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedSource",
            label: "Expected Source",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "edition",
            label: "Edition",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "methodMatches",
            label: "Method Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "sourceMatches",
            label: "Source Matches",
            valueType: { type: "boolean" },
          },
          { id: "key", label: "Key", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = bioremediationRecordSourceMethodPairTool.execute;
export default bioremediationRecordSourceMethodPairTool;
