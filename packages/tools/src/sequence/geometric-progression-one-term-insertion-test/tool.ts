import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly inserted: number;
  readonly right: number;
  readonly tolerance: number;
};
export type Output = {
  readonly residual: number;
  readonly compatible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    inserted: { type: "number" },
    right: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["left", "inserted", "right", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" }, compatible: { type: "boolean" } },
  required: ["residual", "compatible"],
} as const;
/** Calculate geometric progression one term insertion test from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { left, inserted, right, tolerance } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0 && left !== 0 && inserted !== 0);
    const residual = inserted * inserted - left * right;
    return { residual, compatible: Math.abs(residual) <= tolerance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { left: 2, inserted: 4, right: 8, tolerance: 0 },
  output: { residual: 0, compatible: true },
} satisfies ToolExample<Input, Output>;
export const geometricProgressionOneTermInsertionTestTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sequence/geometric-progression-one-term-insertion-test",
      title: "Geometric Progression One Term Insertion Test Tool",
      description:
        "Calculate geometric progression one term insertion test from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          left: { type: "number" },
          inserted: { type: "number" },
          right: { type: "number" },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["left", "inserted", "right", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residual: { type: "number" },
          compatible: { type: "boolean" },
        },
        required: ["residual", "compatible"],
      },
      ports: {
        inputs: [
          {
            id: "left",
            label: "Left",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inserted",
            label: "Inserted",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "right",
            label: "Right",
            required: true,
            valueType: { type: "number" },
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
            id: "compatible",
            label: "Compatible",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geometricProgressionOneTermInsertionTestTool.execute;
export default geometricProgressionOneTermInsertionTestTool;
