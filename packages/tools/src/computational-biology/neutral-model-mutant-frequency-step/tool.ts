import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mutants: number;
  readonly population: number;
  readonly deltaMutants: number;
};
export type Output = {
  readonly nextMutants: number;
  readonly beforeFrequency: number;
  readonly afterFrequency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mutants: { type: "integer", minimum: 0 },
    population: { type: "integer", minimum: 1 },
    deltaMutants: { type: "integer" },
  },
  required: ["mutants", "population", "deltaMutants"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextMutants: { type: "integer" },
    beforeFrequency: { type: "number" },
    afterFrequency: { type: "number" },
  },
  required: ["nextMutants", "beforeFrequency", "afterFrequency"],
} as const;
/** Apply a supplied net replacement change at fixed population size; no neutral-process sampling distribution is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mutants, population, deltaMutants } = request;
  const compute = (): Output => {
    H.integer(population, 1);
    H.integer(mutants, 0, population);
    H.domain(
      mutants + deltaMutants >= 0 && mutants + deltaMutants <= population,
    );
    return {
      nextMutants: mutants + deltaMutants,
      beforeFrequency: mutants / population,
      afterFrequency: (mutants + deltaMutants) / population,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mutants: 20, population: 100, deltaMutants: 1 },
  output: { nextMutants: 21, beforeFrequency: 0.2, afterFrequency: 0.21 },
} satisfies ToolExample<Input, Output>;
export const neutralModelMutantFrequencyStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/neutral-model-mutant-frequency-step",
    title: "Neutral Model Mutant Frequency Step Tool",
    description:
      "Apply a supplied net replacement change at fixed population size; no neutral-process sampling distribution is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mutants: { type: "integer", minimum: 0 },
        population: { type: "integer", minimum: 1 },
        deltaMutants: { type: "integer" },
      },
      required: ["mutants", "population", "deltaMutants"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextMutants: { type: "integer" },
        beforeFrequency: { type: "number" },
        afterFrequency: { type: "number" },
      },
      required: ["nextMutants", "beforeFrequency", "afterFrequency"],
    },
    ports: {
      inputs: [
        {
          id: "mutants",
          label: "Mutants",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "population",
          label: "Population",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "deltaMutants",
          label: "Delta Mutants",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nextMutants",
          label: "Next Mutants",
          valueType: { type: "integer" },
        },
        {
          id: "beforeFrequency",
          label: "Before Frequency",
          valueType: { type: "number" },
        },
        {
          id: "afterFrequency",
          label: "After Frequency",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = neutralModelMutantFrequencyStepTool.execute;
export default neutralModelMutantFrequencyStepTool;
