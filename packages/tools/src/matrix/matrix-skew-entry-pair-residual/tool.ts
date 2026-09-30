import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly aij: number; readonly aji: number };
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { aij: { type: "number" }, aji: { type: "number" } },
  required: ["aij", "aji"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Compute matrix skew entry pair residual from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { aij, aji } = input;
  const compute = (): Output => {
    return { residual: aij + aji };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { aij: 3, aji: -3 },
  output: { residual: 0 },
} satisfies ToolExample<Input, Output>;
export const matrixSkewEntryPairResidualTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-skew-entry-pair-residual",
  title: "Matrix Skew Entry Pair Residual Tool",
  description:
    "Compute matrix skew entry pair residual from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "aij",
        label: "Aij",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "aji",
        label: "Aji",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "residual", label: "Residual", valueType: { type: "number" } },
    ],
  },
});
export const run = matrixSkewEntryPairResidualTool.execute;
export default matrixSkewEntryPairResidualTool;
