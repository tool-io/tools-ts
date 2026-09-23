import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly xy: number;
  readonly yx: number;
  readonly tolerance: number;
};
export type Output = { readonly residual: number; readonly agrees: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    xy: { type: "number" },
    yx: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["xy", "yx", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" }, agrees: { type: "boolean" } },
  required: ["residual", "agrees"],
} as const;
/** Calculate mixed partial commutator residual from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { xy, yx, tolerance } = input;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    const residual = xy - yx;
    return { residual, agrees: Math.abs(residual) <= tolerance };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { xy: 3, yx: 2, tolerance: 0.5 },
  output: { residual: 1, agrees: false },
} satisfies ToolExample<Input, Output>;
export const mixedPartialCommutatorResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/mixed-partial-commutator-residual",
    title: "Mixed Partial Commutator Residual Tool",
    description:
      "Calculate mixed partial commutator residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        xy: { type: "number" },
        yx: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["xy", "yx", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" }, agrees: { type: "boolean" } },
      required: ["residual", "agrees"],
    },
    ports: {
      inputs: [
        {
          id: "xy",
          label: "Xy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yx",
          label: "Yx",
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
        { id: "agrees", label: "Agrees", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = mixedPartialCommutatorResidualTool.execute;
export default mixedPartialCommutatorResidualTool;
