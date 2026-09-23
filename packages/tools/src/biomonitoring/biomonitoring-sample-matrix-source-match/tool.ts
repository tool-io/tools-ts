import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly matrix: string;
  readonly expectedMatrix: string;
  readonly source: string;
  readonly expectedSource: string;
  readonly method: string;
  readonly expectedMethod: string;
};
export type Output = {
  readonly matrixMatches: boolean;
  readonly sourceMatches: boolean;
  readonly methodMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matrix: { type: "string", maxLength: 8192 },
    expectedMatrix: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    expectedSource: { type: "string", maxLength: 8192 },
    method: { type: "string", maxLength: 8192 },
    expectedMethod: { type: "string", maxLength: 8192 },
  },
  required: [
    "matrix",
    "expectedMatrix",
    "source",
    "expectedSource",
    "method",
    "expectedMethod",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matrixMatches: { type: "boolean" },
    sourceMatches: { type: "boolean" },
    methodMatches: { type: "boolean" },
  },
  required: ["matrixMatches", "sourceMatches", "methodMatches"],
} as const;
/** Compare supplied matrix, source and method identifiers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    matrix,
    expectedMatrix,
    source,
    expectedSource,
    method,
    expectedMethod,
  } = request;
  const compute = (): Output => {
    return {
      matrixMatches: matrix === expectedMatrix,
      sourceMatches: source === expectedSource,
      methodMatches: method === expectedMethod,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    matrix: "A",
    expectedMatrix: "A",
    source: "lab1",
    expectedSource: "lab1",
    method: "M1",
    expectedMethod: "M1",
  },
  output: { matrixMatches: true, sourceMatches: true, methodMatches: true },
} satisfies ToolExample<Input, Output>;
export const biomonitoringSampleMatrixSourceMatchTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomonitoring/biomonitoring-sample-matrix-source-match",
      title: "Biomonitoring Sample Matrix Source Match Tool",
      description: "Compare supplied matrix, source and method identifiers.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matrix: { type: "string", maxLength: 8192 },
          expectedMatrix: { type: "string", maxLength: 8192 },
          source: { type: "string", maxLength: 8192 },
          expectedSource: { type: "string", maxLength: 8192 },
          method: { type: "string", maxLength: 8192 },
          expectedMethod: { type: "string", maxLength: 8192 },
        },
        required: [
          "matrix",
          "expectedMatrix",
          "source",
          "expectedSource",
          "method",
          "expectedMethod",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matrixMatches: { type: "boolean" },
          sourceMatches: { type: "boolean" },
          methodMatches: { type: "boolean" },
        },
        required: ["matrixMatches", "sourceMatches", "methodMatches"],
      },
      ports: {
        inputs: [
          {
            id: "matrix",
            label: "Matrix",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedMatrix",
            label: "Expected Matrix",
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
        ],
        outputs: [
          {
            id: "matrixMatches",
            label: "Matrix Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "sourceMatches",
            label: "Source Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "methodMatches",
            label: "Method Matches",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biomonitoringSampleMatrixSourceMatchTool.execute;
export default biomonitoringSampleMatrixSourceMatchTool;
