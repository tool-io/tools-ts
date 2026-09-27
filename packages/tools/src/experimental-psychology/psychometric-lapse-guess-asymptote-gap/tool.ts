import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly guessRate: number;
  readonly lapseRate: number;
  readonly latentProbability: number;
};
export type Output = {
  readonly lowerAsymptote: number;
  readonly upperAsymptote: number;
  readonly predictedProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guessRate: { type: "number", minimum: 0, maximum: 1 },
    lapseRate: { type: "number", minimum: 0, maximum: 1 },
    latentProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["guessRate", "lapseRate", "latentProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerAsymptote: { type: "number" },
    upperAsymptote: { type: "number" },
    predictedProbability: { type: "number" },
  },
  required: ["lowerAsymptote", "upperAsymptote", "predictedProbability"],
} as const;
/** Calculate psychometric lapse guess asymptote gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { guessRate, lapseRate, latentProbability } = request;
  const compute = (): Output => {
    H.probability(guessRate);
    H.probability(lapseRate);
    H.probability(latentProbability);
    H.domain(guessRate + lapseRate <= 1);
    return {
      lowerAsymptote: guessRate,
      upperAsymptote: 1 - lapseRate,
      predictedProbability:
        guessRate + (1 - guessRate - lapseRate) * latentProbability,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { guessRate: 0.5, lapseRate: 0.02, latentProbability: 0.5 },
  output: {
    lowerAsymptote: 0.5,
    upperAsymptote: 0.98,
    predictedProbability: 0.74,
  },
} satisfies ToolExample<Input, Output>;
export const psychometricLapseGuessAsymptoteGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/psychometric-lapse-guess-asymptote-gap",
    title: "Psychometric Lapse Guess Asymptote Gap Tool",
    description:
      "Calculate psychometric lapse guess asymptote gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        guessRate: { type: "number", minimum: 0, maximum: 1 },
        lapseRate: { type: "number", minimum: 0, maximum: 1 },
        latentProbability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["guessRate", "lapseRate", "latentProbability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerAsymptote: { type: "number" },
        upperAsymptote: { type: "number" },
        predictedProbability: { type: "number" },
      },
      required: ["lowerAsymptote", "upperAsymptote", "predictedProbability"],
    },
    ports: {
      inputs: [
        {
          id: "guessRate",
          label: "Guess Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lapseRate",
          label: "Lapse Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latentProbability",
          label: "Latent Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerAsymptote",
          label: "Lower Asymptote",
          valueType: { type: "number" },
        },
        {
          id: "upperAsymptote",
          label: "Upper Asymptote",
          valueType: { type: "number" },
        },
        {
          id: "predictedProbability",
          label: "Predicted Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = psychometricLapseGuessAsymptoteGapTool.execute;
export default psychometricLapseGuessAsymptoteGapTool;
