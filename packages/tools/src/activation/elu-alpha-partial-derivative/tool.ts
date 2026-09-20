import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" } },
  required: ["x"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Return the ELU alpha partial under the x>=0 linear and x<0 exponential convention. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x } = input;
  const compute = (): Output => {
    return { derivative: x < 0 ? Math.expm1(x) : 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: -0.6931471805599453 },
  output: { derivative: -0.5 },
} satisfies ToolExample<Input, Output>;
export const eluAlphaPartialDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/elu-alpha-partial-derivative",
    title: "ELU Alpha Partial Derivative Tool",
    description:
      "Return the ELU alpha partial under the x>=0 linear and x<0 exponential convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" } },
      required: ["x"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eluAlphaPartialDerivativeTool.execute;
export default eluAlphaPartialDerivativeTool;
