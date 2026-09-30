import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly diagonal: number };
export type Output = { readonly inverse: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { diagonal: { type: "number" } },
  required: ["diagonal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inverse: { type: "number" } },
  required: ["inverse"],
} as const;
/** Calculate matrix triangular diagonal inverse entry from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { diagonal } = input;
  const compute = (): Output => {
    H.domain(diagonal !== 0);
    return { inverse: 1 / diagonal };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { diagonal: 4 },
  output: { inverse: 0.25 },
} satisfies ToolExample<Input, Output>;
export const matrixTriangularDiagonalInverseEntryTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "matrix/matrix-triangular-diagonal-inverse-entry",
      title: "Matrix Triangular Diagonal Inverse Entry Tool",
      description:
        "Calculate matrix triangular diagonal inverse entry from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { diagonal: { type: "number" } },
        required: ["diagonal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { inverse: { type: "number" } },
        required: ["inverse"],
      },
      ports: {
        inputs: [
          {
            id: "diagonal",
            label: "Diagonal",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "inverse", label: "Inverse", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = matrixTriangularDiagonalInverseEntryTool.execute;
export default matrixTriangularDiagonalInverseEntryTool;
