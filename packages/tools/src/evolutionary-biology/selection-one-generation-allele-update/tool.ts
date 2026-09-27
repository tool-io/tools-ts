import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly p: number;
  readonly fitnessAA: number;
  readonly fitnessAa: number;
  readonly fitnessaa: number;
};
export type Output = { readonly meanFitness: number; readonly nextP: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    p: { type: "number", minimum: 0, maximum: 1 },
    fitnessAA: { type: "number", minimum: 0 },
    fitnessAa: { type: "number", minimum: 0 },
    fitnessaa: { type: "number", minimum: 0 },
  },
  required: ["p", "fitnessAA", "fitnessAa", "fitnessaa"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meanFitness: { type: "number" }, nextP: { type: "number" } },
  required: ["meanFitness", "nextP"],
} as const;
/** Diploid viability selection from Hardy-Weinberg zygotes, with explicit genotype fitnesses and no other evolutionary force. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { p, fitnessAA, fitnessAa, fitnessaa } = request;
  const compute = (): Output => {
    H.probability(p);
    H.domain(fitnessAA >= 0 && fitnessAa >= 0 && fitnessaa >= 0);
    const q = 1 - p,
      meanFitness =
        p * p * fitnessAA + 2 * p * q * fitnessAa + q * q * fitnessaa;
    H.positive(meanFitness);
    return {
      meanFitness,
      nextP: (p * p * fitnessAA + p * q * fitnessAa) / meanFitness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { p: 0.5, fitnessAA: 2, fitnessAa: 1, fitnessaa: 0 },
  output: { meanFitness: 1, nextP: 0.75 },
} satisfies ToolExample<Input, Output>;
export const selectionOneGenerationAlleleUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/selection-one-generation-allele-update",
    title: "Selection One Generation Allele Update Tool",
    description:
      "Diploid viability selection from Hardy-Weinberg zygotes, with explicit genotype fitnesses and no other evolutionary force.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        p: { type: "number", minimum: 0, maximum: 1 },
        fitnessAA: { type: "number", minimum: 0 },
        fitnessAa: { type: "number", minimum: 0 },
        fitnessaa: { type: "number", minimum: 0 },
      },
      required: ["p", "fitnessAA", "fitnessAa", "fitnessaa"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanFitness: { type: "number" },
        nextP: { type: "number" },
      },
      required: ["meanFitness", "nextP"],
    },
    ports: {
      inputs: [
        { id: "p", label: "P", required: true, valueType: { type: "number" } },
        {
          id: "fitnessAA",
          label: "Fitness AA",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fitnessAa",
          label: "Fitness Aa",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fitnessaa",
          label: "Fitnessaa",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meanFitness",
          label: "Mean Fitness",
          valueType: { type: "number" },
        },
        { id: "nextP", label: "Next P", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = selectionOneGenerationAlleleUpdateTool.execute;
export default selectionOneGenerationAlleleUpdateTool;
