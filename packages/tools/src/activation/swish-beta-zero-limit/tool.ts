import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number };
export type Output = {
  readonly limit: number;
  readonly betaDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" } },
  required: ["x"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { limit: { type: "number" }, betaDerivative: { type: "number" } },
  required: ["limit", "betaDerivative"],
} as const;
/** Return the beta=0 Swish value and its first beta derivative, from sigmoid(0)=1/2. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x } = request;
  const compute = (): Output => {
    return { limit: x / 2, betaDerivative: (x * x) / 4 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 4 },
  output: { limit: 2, betaDerivative: 4 },
} satisfies ToolExample<Input, Output>;
export const swishBetaZeroLimitTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "activation/swish-beta-zero-limit",
    title: "Swish Beta Zero Limit Tool",
    description:
      "Return the beta=0 Swish value and its first beta derivative, from sigmoid(0)=1/2.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" } },
      required: ["x"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        limit: { type: "number" },
        betaDerivative: { type: "number" },
      },
      required: ["limit", "betaDerivative"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        { id: "limit", label: "Limit", valueType: { type: "number" } },
        {
          id: "betaDerivative",
          label: "Beta Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = swishBetaZeroLimitTool.execute;
export default swishBetaZeroLimitTool;
