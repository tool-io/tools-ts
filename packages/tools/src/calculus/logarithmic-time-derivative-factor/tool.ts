import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly time: number; readonly derivative: number };
export type Output = { readonly logTimeDerivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number", exclusiveMinimum: 0 },
    derivative: { type: "number" },
  },
  required: ["time", "derivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logTimeDerivative: { type: "number" } },
  required: ["logTimeDerivative"],
} as const;
/** Calculate logarithmic time derivative factor from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { time, derivative } = input;
  const compute = (): Output => {
    H.positive(time);
    return { logTimeDerivative: time * derivative };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { time: 4, derivative: 3 },
  output: { logTimeDerivative: 12 },
} satisfies ToolExample<Input, Output>;
export const logarithmicTimeDerivativeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/logarithmic-time-derivative-factor",
    title: "Logarithmic Time Derivative Factor Tool",
    description:
      "Calculate logarithmic time derivative factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number", exclusiveMinimum: 0 },
        derivative: { type: "number" },
      },
      required: ["time", "derivative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logTimeDerivative: { type: "number" } },
      required: ["logTimeDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "derivative",
          label: "Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "logTimeDerivative",
          label: "Log Time Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = logarithmicTimeDerivativeFactorTool.execute;
export default logarithmicTimeDerivativeFactorTool;
