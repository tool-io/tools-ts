import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly constant: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    constant: { type: "number" },
  },
  required: ["first", "second", "constant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Calculate reciprocal proportion constraint residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, constant } = request;
  const compute = (): Output => {
    return { residual: first * second - constant };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 3, second: 4, constant: 10 },
  output: { residual: 2 },
} satisfies ToolExample<Input, Output>;
export const reciprocalProportionConstraintResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/reciprocal-proportion-constraint-residual",
      title: "Reciprocal Proportion Constraint Residual Tool",
      description:
        "Calculate reciprocal proportion constraint residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "number" },
          second: { type: "number" },
          constant: { type: "number" },
        },
        required: ["first", "second", "constant"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { residual: { type: "number" } },
        required: ["residual"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "constant",
            label: "Constant",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = reciprocalProportionConstraintResidualTool.execute;
export default reciprocalProportionConstraintResidualTool;
