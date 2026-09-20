import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly temperature: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    temperature: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "temperature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate tanh(x/temperature) with respect to positive temperature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, temperature } = request;
  const compute = (): Output => {
    H.positive(temperature);
    const t = Math.tanh(x / temperature);
    return {
      derivative:
        1 - t * t === 0 ? 0 : (-x * (1 - t * t)) / (temperature * temperature),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 2, temperature: 2 },
  output: { derivative: -0.20998717080701307 },
} satisfies ToolExample<Input, Output>;
export const tanhTemperatureSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/tanh-temperature-sensitivity",
    title: "Tanh Temperature Sensitivity Tool",
    description:
      "Differentiate tanh(x/temperature) with respect to positive temperature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        temperature: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["x", "temperature"],
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
        {
          id: "temperature",
          label: "Temperature",
          required: true,
          valueType: { type: "number" },
        },
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
export const run = tanhTemperatureSensitivityTool.execute;
export default tanhTemperatureSensitivityTool;
