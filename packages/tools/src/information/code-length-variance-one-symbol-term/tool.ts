import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probability: number;
  readonly length: number;
  readonly averageLength: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", minimum: 0, maximum: 1 },
    length: { type: "number", minimum: 0 },
    averageLength: { type: "number", minimum: 0 },
  },
  required: ["probability", "length", "averageLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate code length variance one symbol term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, length, averageLength } = request;
  const compute = (): Output => {
    H.probability(probability);
    H.domain(length >= 0 && averageLength >= 0);
    return { contribution: probability * (length - averageLength) ** 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.25, length: 5, averageLength: 3 },
  output: { contribution: 1 },
} satisfies ToolExample<Input, Output>;
export const codeLengthVarianceOneSymbolTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/code-length-variance-one-symbol-term",
    title: "Code Length Variance One Symbol Term Tool",
    description:
      "Calculate code length variance one symbol term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: { type: "number", minimum: 0, maximum: 1 },
        length: { type: "number", minimum: 0 },
        averageLength: { type: "number", minimum: 0 },
      },
      required: ["probability", "length", "averageLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "averageLength",
          label: "Average Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = codeLengthVarianceOneSymbolTermTool.execute;
export default codeLengthVarianceOneSymbolTermTool;
