import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceFitness: number;
  readonly effect: number;
  readonly dominance: number;
  readonly alleleCopies: number;
};
export type Output = {
  readonly contribution: number;
  readonly resultingFitness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceFitness: { type: "number" },
    effect: { type: "number" },
    dominance: { type: "number", minimum: 0, maximum: 1 },
    alleleCopies: { type: "integer", minimum: 0, maximum: 2 },
  },
  required: ["referenceFitness", "effect", "dominance", "alleleCopies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contribution: { type: "number" },
    resultingFitness: { type: "number" },
  },
  required: ["contribution", "resultingFitness"],
} as const;
/** Diploid additive-on-fitness coding gives heterozygote h*s and variant homozygote s; parameters are supplied rather than inferred from sequence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceFitness, effect, dominance, alleleCopies } = request;
  const compute = (): Output => {
    H.integer(alleleCopies, 0, 2);
    H.probability(dominance);
    return {
      contribution:
        alleleCopies === 0
          ? 0
          : alleleCopies === 1
            ? effect * dominance
            : effect,
      resultingFitness:
        referenceFitness +
        (alleleCopies === 0
          ? 0
          : alleleCopies === 1
            ? effect * dominance
            : effect),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceFitness: 1, effect: 0.2, dominance: 0.5, alleleCopies: 1 },
  output: { contribution: 0.1, resultingFitness: 1.1 },
} satisfies ToolExample<Input, Output>;
export const sequenceFitnessOneLocusContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "computational-biology/sequence-fitness-one-locus-contribution",
      title: "Sequence Fitness One Locus Contribution Tool",
      description:
        "Diploid additive-on-fitness coding gives heterozygote h*s and variant homozygote s; parameters are supplied rather than inferred from sequence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceFitness: { type: "number" },
          effect: { type: "number" },
          dominance: { type: "number", minimum: 0, maximum: 1 },
          alleleCopies: { type: "integer", minimum: 0, maximum: 2 },
        },
        required: ["referenceFitness", "effect", "dominance", "alleleCopies"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contribution: { type: "number" },
          resultingFitness: { type: "number" },
        },
        required: ["contribution", "resultingFitness"],
      },
      ports: {
        inputs: [
          {
            id: "referenceFitness",
            label: "Reference Fitness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "effect",
            label: "Effect",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dominance",
            label: "Dominance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "alleleCopies",
            label: "Allele Copies",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "contribution",
            label: "Contribution",
            valueType: { type: "number" },
          },
          {
            id: "resultingFitness",
            label: "Resulting Fitness",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sequenceFitnessOneLocusContributionTool.execute;
export default sequenceFitnessOneLocusContributionTool;
