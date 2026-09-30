import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diagonal: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly singularByTolerance: boolean;
  readonly problematicIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diagonal: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["diagonal", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    singularByTolerance: { type: "boolean" },
    problematicIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["singularByTolerance", "problematicIndices"],
} as const;
/** Flag a supplied triangular diagonal against an explicit absolute pivot tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diagonal, tolerance } = request;
  const compute = (): Output => {
    H.domain(diagonal.length > 0 && tolerance >= 0);
    const problematicIndices = diagonal.flatMap((x, i) =>
      Math.abs(x) <= tolerance ? [i] : [],
    );
    return {
      singularByTolerance: problematicIndices.length > 0,
      problematicIndices,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diagonal: [2, 0, 3], tolerance: 0 },
  output: { singularByTolerance: true, problematicIndices: [1] },
} satisfies ToolExample<Input, Output>;
export const matrixTriangularSolveDiagonalFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-triangular-solve-diagonal-flag",
    title: "Matrix Triangular Solve Diagonal Flag Tool",
    description:
      "Flag a supplied triangular diagonal against an explicit absolute pivot tolerance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diagonal: { type: "array", maxItems: 256, items: { type: "number" } },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["diagonal", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        singularByTolerance: { type: "boolean" },
        problematicIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["singularByTolerance", "problematicIndices"],
    },
    ports: {
      inputs: [
        {
          id: "diagonal",
          label: "Diagonal",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "singularByTolerance",
          label: "Singular By Tolerance",
          valueType: { type: "boolean" },
        },
        {
          id: "problematicIndices",
          label: "Problematic Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixTriangularSolveDiagonalFlagTool.execute;
export default matrixTriangularSolveDiagonalFlagTool;
