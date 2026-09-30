import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly left: number; readonly right: number };
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "integer", minimum: 0 },
    right: { type: "integer", minimum: 0 },
  },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "integer" } },
  required: ["factor"],
} as const;
/** Compute matrix column swap parity factor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    integer(left);
    integer(right);
    return { factor: left === right ? 1 : -1 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 2, right: 3 },
  output: { factor: -1 },
} satisfies ToolExample<Input, Output>;
export const matrixColumnSwapParityFactorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-column-swap-parity-factor",
  title: "Matrix Column Swap Parity Factor Tool",
  description:
    "Compute matrix column swap parity factor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "factor", label: "Factor", valueType: { type: "integer" } },
    ],
  },
});
export const run = matrixColumnSwapParityFactorTool.execute;
export default matrixColumnSwapParityFactorTool;
