import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly cosine: number; readonly tolerance: number };
export type Output = { readonly value: number; readonly clamped: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cosine: { type: "number" }, tolerance: { type: "number" } },
  required: ["cosine", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" }, clamped: { type: "boolean" } },
  required: ["value", "clamped"],
} as const;
/** Compute cosine dot product roundoff clamp from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { cosine, tolerance } = input;
  const compute = (): Output => {
    domain(tolerance >= 0 && tolerance <= 1e-3);
    domain(cosine >= -1 - tolerance && cosine <= 1 + tolerance);
    const value = Math.max(-1, Math.min(1, cosine));
    return { value, clamped: value !== cosine };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { cosine: 1.0000001, tolerance: 0.000001 },
  output: { value: 1, clamped: true },
} satisfies ToolExample<Input, Output>;
export const cosineDotProductRoundoffClampTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/cosine-dot-product-roundoff-clamp",
  title: "Cosine Dot Product Roundoff Clamp Tool",
  description:
    "Compute cosine dot product roundoff clamp from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "cosine",
        label: "Cosine",
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
      { id: "value", label: "Value", valueType: { type: "number" } },
      { id: "clamped", label: "Clamped", valueType: { type: "boolean" } },
    ],
  },
});
export const run = cosineDotProductRoundoffClampTool.execute;
export default cosineDotProductRoundoffClampTool;
