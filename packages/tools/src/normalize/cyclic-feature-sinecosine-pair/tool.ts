import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly period: number;
  readonly origin: number;
};
export type Output = { readonly sine: number; readonly cosine: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    period: { type: "number", exclusiveMinimum: 0 },
    origin: { type: "number" },
  },
  required: ["value", "period", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sine: { type: "number" }, cosine: { type: "number" } },
  required: ["sine", "cosine"],
} as const;
/** Calculate cyclic feature sinecosine pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, period, origin } = input;
  const compute = (): Output => {
    H.positive(period);
    const angle = (2 * Math.PI * (value - origin)) / period;
    return { sine: Math.sin(angle), cosine: Math.cos(angle) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 6, period: 24, origin: 0 },
  output: { sine: 1, cosine: 6.123233995736766e-17 },
} satisfies ToolExample<Input, Output>;
export const cyclicFeatureSinecosinePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/cyclic-feature-sinecosine-pair",
    title: "Cyclic Feature Sinecosine Pair Tool",
    description:
      "Calculate cyclic feature sinecosine pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        period: { type: "number", exclusiveMinimum: 0 },
        origin: { type: "number" },
      },
      required: ["value", "period", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sine: { type: "number" }, cosine: { type: "number" } },
      required: ["sine", "cosine"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "sine", label: "Sine", valueType: { type: "number" } },
        { id: "cosine", label: "Cosine", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cyclicFeatureSinecosinePairTool.execute;
export default cyclicFeatureSinecosinePairTool;
