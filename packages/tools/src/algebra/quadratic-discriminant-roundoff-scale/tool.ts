import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
};
export type Output = { readonly scale: number };
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
  properties: { scale: { type: "number" } },
  required: ["scale"],
} as const;
/** Compute quadratic discriminant roundoff scale from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { a, b, c } = input;
  const compute = (): Output => {
    return { scale: Math.abs(b * b) + Math.abs(4 * a * c) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 2, b: 3, c: -4 },
  output: { scale: 41 },
} satisfies ToolExample<Input, Output>;
export const quadraticDiscriminantRoundoffScaleTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "algebra/quadratic-discriminant-roundoff-scale",
  title: "Quadratic Discriminant Roundoff Scale Tool",
  description:
    "Compute quadratic discriminant roundoff scale from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "a", label: "A", required: true, valueType: { type: "number" } },
      { id: "b", label: "B", required: true, valueType: { type: "number" } },
      { id: "c", label: "C", required: true, valueType: { type: "number" } },
    ],
    outputs: [{ id: "scale", label: "Scale", valueType: { type: "number" } }],
  },
});
export const run = quadraticDiscriminantRoundoffScaleTool.execute;
export default quadraticDiscriminantRoundoffScaleTool;
