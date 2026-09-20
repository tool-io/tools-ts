import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number };
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" } },
  required: ["x"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Evaluate sinh(x)/(cosh(x)+1) using the stable equivalent tanh(x/2). */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x } = request;
  const compute = (): Output => {
    return { ratio: Math.tanh(x / 2) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 1.0986122886681096 },
  output: { ratio: 0.49999999999999994 },
} satisfies ToolExample<Input, Output>;
export const tanhHalfAngleRatioTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "activation/tanh-half-angle-ratio",
    title: "Tanh Half Angle Ratio Tool",
    description:
      "Evaluate sinh(x)/(cosh(x)+1) using the stable equivalent tanh(x/2).",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" } },
      required: ["x"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = tanhHalfAngleRatioTool.execute;
export default tanhHalfAngleRatioTool;
