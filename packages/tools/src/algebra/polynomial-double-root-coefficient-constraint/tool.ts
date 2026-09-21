import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
};
export type Output = {
  readonly residual: number;
  readonly doubleRoot: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number" },
    b: { type: "number" },
    c: { type: "number" },
  },
  required: ["a", "b", "c"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" }, doubleRoot: { type: "boolean" } },
  required: ["residual", "doubleRoot"],
} as const;
/** Calculate polynomial double root coefficient constraint from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, c } = input;
  const compute = (): Output => {
    H.domain(a !== 0);
    const residual = b * b - 4 * a * c;
    return { residual, doubleRoot: residual === 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 2, b: -8, c: 8 },
  output: { residual: 0, doubleRoot: true },
} satisfies ToolExample<Input, Output>;
export const polynomialDoubleRootCoefficientConstraintTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "algebra/polynomial-double-root-coefficient-constraint",
      title: "Polynomial Double Root Coefficient Constraint Tool",
      description:
        "Calculate polynomial double root coefficient constraint from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          a: { type: "number" },
          b: { type: "number" },
          c: { type: "number" },
        },
        required: ["a", "b", "c"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residual: { type: "number" },
          doubleRoot: { type: "boolean" },
        },
        required: ["residual", "doubleRoot"],
      },
      ports: {
        inputs: [
          {
            id: "a",
            label: "A",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "b",
            label: "B",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "c",
            label: "C",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          {
            id: "doubleRoot",
            label: "Double Root",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = polynomialDoubleRootCoefficientConstraintTool.execute;
export default polynomialDoubleRootCoefficientConstraintTool;
