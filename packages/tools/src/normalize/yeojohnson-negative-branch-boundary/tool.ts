import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly lambda: number };
export type Output = {
  readonly transformed: number;
  readonly logarithmicBranch: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number", maximum: 0 },
    lambda: { type: "number" },
  },
  required: ["value", "lambda"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transformed: { type: "number" },
    logarithmicBranch: { type: "boolean" },
  },
  required: ["transformed", "logarithmicBranch"],
} as const;
/** Calculate yeojohnson negative branch boundary from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lambda } = request;
  const compute = (): Output => {
    H.domain(value <= 0);
    const a = 2 - lambda,
      logarithm = Math.log1p(-value);
    return {
      transformed: a === 0 ? -logarithm : -Math.expm1(a * logarithm) / a,
      logarithmicBranch: a === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: -3, lambda: 2 },
  output: { transformed: -1.3862943611198906, logarithmicBranch: true },
} satisfies ToolExample<Input, Output>;
export const yeojohnsonNegativeBranchBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/yeojohnson-negative-branch-boundary",
    title: "Yeojohnson Negative Branch Boundary Tool",
    description:
      "Calculate yeojohnson negative branch boundary from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number", maximum: 0 },
        lambda: { type: "number" },
      },
      required: ["value", "lambda"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transformed: { type: "number" },
        logarithmicBranch: { type: "boolean" },
      },
      required: ["transformed", "logarithmicBranch"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lambda",
          label: "Lambda",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transformed",
          label: "Transformed",
          valueType: { type: "number" },
        },
        {
          id: "logarithmicBranch",
          label: "Logarithmic Branch",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = yeojohnsonNegativeBranchBoundaryTool.execute;
export default yeojohnsonNegativeBranchBoundaryTool;
