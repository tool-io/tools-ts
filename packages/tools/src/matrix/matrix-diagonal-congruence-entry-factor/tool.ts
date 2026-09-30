import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entry: number;
  readonly rowFactor: number;
  readonly columnFactor: number;
};
export type Output = {
  readonly factor: number;
  readonly transformedEntry: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entry: { type: "number" },
    rowFactor: { type: "number" },
    columnFactor: { type: "number" },
  },
  required: ["entry", "rowFactor", "columnFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    factor: { type: "number" },
    transformedEntry: { type: "number" },
  },
  required: ["factor", "transformedEntry"],
} as const;
/** One entry of D A D using the supplied row and column diagonal factors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entry, rowFactor, columnFactor } = request;
  const compute = (): Output => {
    return {
      factor: rowFactor * columnFactor,
      transformedEntry: rowFactor * entry * columnFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entry: 3, rowFactor: 2, columnFactor: 4 },
  output: { factor: 8, transformedEntry: 24 },
} satisfies ToolExample<Input, Output>;
export const matrixDiagonalCongruenceEntryFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "matrix/matrix-diagonal-congruence-entry-factor",
      title: "Matrix Diagonal Congruence Entry Factor Tool",
      description:
        "One entry of D A D using the supplied row and column diagonal factors.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entry: { type: "number" },
          rowFactor: { type: "number" },
          columnFactor: { type: "number" },
        },
        required: ["entry", "rowFactor", "columnFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          factor: { type: "number" },
          transformedEntry: { type: "number" },
        },
        required: ["factor", "transformedEntry"],
      },
      ports: {
        inputs: [
          {
            id: "entry",
            label: "Entry",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rowFactor",
            label: "Row Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "columnFactor",
            label: "Column Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "factor", label: "Factor", valueType: { type: "number" } },
          {
            id: "transformedEntry",
            label: "Transformed Entry",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = matrixDiagonalCongruenceEntryFactorTool.execute;
export default matrixDiagonalCongruenceEntryFactorTool;
