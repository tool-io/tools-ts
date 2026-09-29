import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number };
export type Output = { readonly support: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { probability: { type: "number", minimum: 0, maximum: 1 } },
  required: ["probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { support: { type: "integer" } },
  required: ["support"],
} as const;
/** Calculate rényi order zero support indicator from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { probability } = input;
  const compute = (): Output => {
    H.probability(probability);
    return { support: probability > 0 ? 1 : 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { probability: 0.2 },
  output: { support: 1 },
} satisfies ToolExample<Input, Output>;
export const renyiOrderZeroSupportIndicatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/renyi-order-zero-support-indicator",
    title: "Rényi Order Zero Support Indicator Tool",
    description:
      "Calculate rényi order zero support indicator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { probability: { type: "number", minimum: 0, maximum: 1 } },
      required: ["probability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { support: { type: "integer" } },
      required: ["support"],
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
        { id: "support", label: "Support", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = renyiOrderZeroSupportIndicatorTool.execute;
export default renyiOrderZeroSupportIndicatorTool;
