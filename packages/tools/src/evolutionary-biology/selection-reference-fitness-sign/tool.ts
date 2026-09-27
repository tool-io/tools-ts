import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fitness: number;
  readonly referenceFitness: number;
};
export type Output = {
  readonly relativeFitness: number;
  readonly selectionCoefficient: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fitness: { type: "number", minimum: 0 },
    referenceFitness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["fitness", "referenceFitness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeFitness: { type: "number" },
    selectionCoefficient: { type: "number" },
  },
  required: ["relativeFitness", "selectionCoefficient"],
} as const;
/** Explicit 1−relative-fitness sign convention, preserving negative values above the reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fitness, referenceFitness } = request;
  const compute = (): Output => {
    H.domain(fitness >= 0);
    H.positive(referenceFitness);
    return {
      relativeFitness: fitness / referenceFitness,
      selectionCoefficient: 1 - fitness / referenceFitness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fitness: 0.8, referenceFitness: 1 },
  output: { relativeFitness: 0.8, selectionCoefficient: 0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const selectionReferenceFitnessSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/selection-reference-fitness-sign",
    title: "Selection Reference Fitness Sign Tool",
    description:
      "Explicit 1−relative-fitness sign convention, preserving negative values above the reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fitness: { type: "number", minimum: 0 },
        referenceFitness: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["fitness", "referenceFitness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeFitness: { type: "number" },
        selectionCoefficient: { type: "number" },
      },
      required: ["relativeFitness", "selectionCoefficient"],
    },
    ports: {
      inputs: [
        {
          id: "fitness",
          label: "Fitness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFitness",
          label: "Reference Fitness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeFitness",
          label: "Relative Fitness",
          valueType: { type: "number" },
        },
        {
          id: "selectionCoefficient",
          label: "Selection Coefficient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = selectionReferenceFitnessSignTool.execute;
export default selectionReferenceFitnessSignTool;
