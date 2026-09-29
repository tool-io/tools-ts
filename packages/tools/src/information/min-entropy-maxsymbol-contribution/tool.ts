import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly maximumProbability: number };
export type Output = { readonly bits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maximumProbability: {
      type: "number",
      exclusiveMinimum: 0,
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["maximumProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bits: { type: "number" } },
  required: ["bits"],
} as const;
/** Calculate min entropy maxsymbol contribution from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { maximumProbability } = input;
  const compute = (): Output => {
    H.probability(maximumProbability);
    H.positive(maximumProbability);
    return { bits: -Math.log2(maximumProbability) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { maximumProbability: 0.25 },
  output: { bits: 2 },
} satisfies ToolExample<Input, Output>;
export const minEntropyMaxsymbolContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/min-entropy-maxsymbol-contribution",
    title: "Min Entropy Maxsymbol Contribution Tool",
    description:
      "Calculate min entropy maxsymbol contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maximumProbability: {
          type: "number",
          exclusiveMinimum: 0,
          minimum: 0,
          maximum: 1,
        },
      },
      required: ["maximumProbability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bits: { type: "number" } },
      required: ["bits"],
    },
    ports: {
      inputs: [
        {
          id: "maximumProbability",
          label: "Maximum Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "bits", label: "Bits", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = minEntropyMaxsymbolContributionTool.execute;
export default minEntropyMaxsymbolContributionTool;
