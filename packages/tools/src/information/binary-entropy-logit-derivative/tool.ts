import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { probability: { type: "number", minimum: 0, maximum: 1 } },
  required: ["probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate binary entropy logit derivative from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability } = request;
  const compute = (): Output => {
    H.probability(probability);
    return {
      derivative:
        probability === 0 || probability === 1
          ? 0
          : probability *
            (1 - probability) *
            Math.log2((1 - probability) / probability),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.25 },
  output: { derivative: 0.29718046888521676 },
} satisfies ToolExample<Input, Output>;
export const binaryEntropyLogitDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/binary-entropy-logit-derivative",
    title: "Binary Entropy Logit Derivative Tool",
    description:
      "Calculate binary entropy logit derivative from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { probability: { type: "number", minimum: 0, maximum: 1 } },
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
export const run = binaryEntropyLogitDerivativeTool.execute;
export default binaryEntropyLogitDerivativeTool;
