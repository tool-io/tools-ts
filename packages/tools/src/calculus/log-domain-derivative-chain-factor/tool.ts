import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly value: number;
  readonly derivative: number;
  readonly base: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number", exclusiveMinimum: 0 },
    derivative: { type: "number" },
    base: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "derivative", "base"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Compute log domain derivative chain factor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, derivative, base } = input;
  const compute = (): Output => {
    positive(value);
    positive(base);
    domain(base !== 1);
    return { derivative: derivative / value / Math.log(base) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 2, derivative: 4, base: 2.718281828459045 },
  output: { derivative: 2 },
} satisfies ToolExample<Input, Output>;
export const logDomainDerivativeChainFactorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/log-domain-derivative-chain-factor",
  title: "Log Domain Derivative Chain Factor Tool",
  description:
    "Compute log domain derivative chain factor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "derivative",
        label: "Derivative",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "base",
        label: "Base",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "derivative", label: "Derivative", valueType: { type: "number" } },
    ],
  },
});
export const run = logDomainDerivativeChainFactorTool.execute;
export default logDomainDerivativeChainFactorTool;
