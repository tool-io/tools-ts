import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number };
export type Output = { readonly logDerivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" } },
  required: ["x"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logDerivative: { type: "number" } },
  required: ["logDerivative"],
} as const;
/** Evaluate log(sigmoid′(x)) stably without first forming an underflowing derivative. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x } = request;
  const compute = (): Output => {
    return {
      logDerivative: -Math.abs(x) - 2 * Math.log1p(Math.exp(-Math.abs(x))),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 0 },
  output: { logDerivative: -1.3862943611198906 },
} satisfies ToolExample<Input, Output>;
export const sigmoidLogDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/sigmoid-log-derivative",
    title: "Sigmoid Log Derivative Tool",
    description:
      "Evaluate log(sigmoid′(x)) stably without first forming an underflowing derivative.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" } },
      required: ["x"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logDerivative: { type: "number" } },
      required: ["logDerivative"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        {
          id: "logDerivative",
          label: "Log Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sigmoidLogDerivativeTool.execute;
export default sigmoidLogDerivativeTool;
