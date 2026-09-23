import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly derivative: number;
  readonly inputHalfwidth: number;
};
export type Output = { readonly outputHalfwidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivative: { type: "number" },
    inputHalfwidth: { type: "number" },
  },
  required: ["derivative", "inputHalfwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outputHalfwidth: { type: "number" } },
  required: ["outputHalfwidth"],
} as const;
/** Compute scalar derivative error propagation factor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { derivative, inputHalfwidth } = input;
  const compute = (): Output => {
    domain(inputHalfwidth >= 0);
    return { outputHalfwidth: Math.abs(derivative) * inputHalfwidth };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { derivative: -3, inputHalfwidth: 0.2 },
  output: { outputHalfwidth: 0.6000000000000001 },
} satisfies ToolExample<Input, Output>;
export const scalarDerivativeErrorPropagationFactorTool =
  defineSchemaCalculation<Input, Output>({
    id: "calculus/scalar-derivative-error-propagation-factor",
    title: "Scalar Derivative Error Propagation Factor Tool",
    description:
      "Compute scalar derivative error propagation factor from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "derivative",
          label: "Derivative",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputHalfwidth",
          label: "Input Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outputHalfwidth",
          label: "Output Halfwidth",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = scalarDerivativeErrorPropagationFactorTool.execute;
export default scalarDerivativeErrorPropagationFactorTool;
