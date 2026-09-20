import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number };
export type Output = { readonly product: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" } },
  required: ["x"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { product: { type: "number" } },
  required: ["product"],
} as const;
/** Evaluate sigmoid(x)*(1−sigmoid(x)) without overflow on extreme inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x } = request;
  const compute = (): Output => {
    return {
      product: Math.exp(-Math.abs(x)) / (1 + Math.exp(-Math.abs(x))) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 1.0986122886681096 },
  output: { product: 0.18749999999999997 },
} satisfies ToolExample<Input, Output>;
export const sigmoidComplementProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/sigmoid-complement-product",
    title: "Sigmoid Complement Product Tool",
    description:
      "Evaluate sigmoid(x)*(1−sigmoid(x)) without overflow on extreme inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" } },
      required: ["x"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { product: { type: "number" } },
      required: ["product"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        { id: "product", label: "Product", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sigmoidComplementProductTool.execute;
export default sigmoidComplementProductTool;
