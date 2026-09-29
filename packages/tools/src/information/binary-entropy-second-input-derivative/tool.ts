import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
  },
  required: ["probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate binary entropy second input derivative from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { probability } = input;
  const compute = (): Output => {
    H.domain(probability > 0 && probability < 1);
    return { derivative: -1 / (Math.LN2 * probability * (1 - probability)) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { probability: 0.5 },
  output: { derivative: -5.7707801635558535 },
} satisfies ToolExample<Input, Output>;
export const binaryEntropySecondInputDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/binary-entropy-second-input-derivative",
    title: "Binary Entropy Second Input Derivative Tool",
    description:
      "Calculate binary entropy second input derivative from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: {
          type: "number",
          exclusiveMinimum: 0,
          exclusiveMaximum: 1,
        },
      },
      required: ["probability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
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
export const run = binaryEntropySecondInputDerivativeTool.execute;
export default binaryEntropySecondInputDerivativeTool;
