import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: readonly number[];
  readonly vector: readonly number[];
  readonly tolerance: number;
};
export type Output = { readonly residual: number; readonly satisfies: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "array", maxItems: 256, items: { type: "number" } },
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["row", "vector", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" }, satisfies: { type: "boolean" } },
  required: ["residual", "satisfies"],
} as const;
/** Calculate vector nullspace single constraint residual from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { row, vector, tolerance } = input;
  const compute = (): Output => {
    H.sameLength(row, vector);
    H.domain(tolerance >= 0);
    const residual = H.dot(row, vector);
    return { residual, satisfies: Math.abs(residual) <= tolerance };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: [1, 2], vector: [2, -1], tolerance: 0 },
  output: { residual: 0, satisfies: true },
} satisfies ToolExample<Input, Output>;
export const vectorNullspaceSingleConstraintResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-nullspace-single-constraint-residual",
      title: "Vector Nullspace Single Constraint Residual Tool",
      description:
        "Calculate vector nullspace single constraint residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          row: { type: "array", maxItems: 256, items: { type: "number" } },
          vector: { type: "array", maxItems: 256, items: { type: "number" } },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["row", "vector", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residual: { type: "number" },
          satisfies: { type: "boolean" },
        },
        required: ["residual", "satisfies"],
      },
      ports: {
        inputs: [
          {
            id: "row",
            label: "Row",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "vector",
            label: "Vector",
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
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          {
            id: "satisfies",
            label: "Satisfies",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vectorNullspaceSingleConstraintResidualTool.execute;
export default vectorNullspaceSingleConstraintResidualTool;
