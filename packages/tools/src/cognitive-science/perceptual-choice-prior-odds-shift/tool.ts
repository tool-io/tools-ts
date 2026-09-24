import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorProbability: number;
  readonly likelihoodRatio: number;
};
export type Output = {
  readonly priorOdds: number;
  readonly posteriorOdds: number;
  readonly posteriorProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorProbability: {
      type: "number",
      exclusiveMinimum: 0,
      exclusiveMaximum: 1,
    },
    likelihoodRatio: { type: "number", minimum: 0 },
  },
  required: ["priorProbability", "likelihoodRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorOdds: { type: "number" },
    posteriorOdds: { type: "number" },
    posteriorProbability: { type: "number" },
  },
  required: ["priorOdds", "posteriorOdds", "posteriorProbability"],
} as const;
/** Binary supplied likelihood-ratio update, without fitting a perceptual model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorProbability, likelihoodRatio } = request;
  const compute = (): Output => {
    H.domain(
      priorProbability > 0 && priorProbability < 1 && likelihoodRatio >= 0,
    );
    return {
      priorOdds: priorProbability / (1 - priorProbability),
      posteriorOdds:
        (priorProbability / (1 - priorProbability)) * likelihoodRatio,
      posteriorProbability:
        (priorProbability * likelihoodRatio) /
        (1 - priorProbability + priorProbability * likelihoodRatio),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priorProbability: 0.5, likelihoodRatio: 3 },
  output: { priorOdds: 1, posteriorOdds: 3, posteriorProbability: 0.75 },
} satisfies ToolExample<Input, Output>;
export const perceptualChoicePriorOddsShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/perceptual-choice-prior-odds-shift",
    title: "Perceptual Choice Prior Odds Shift Tool",
    description:
      "Binary supplied likelihood-ratio update, without fitting a perceptual model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorProbability: {
          type: "number",
          exclusiveMinimum: 0,
          exclusiveMaximum: 1,
        },
        likelihoodRatio: { type: "number", minimum: 0 },
      },
      required: ["priorProbability", "likelihoodRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorOdds: { type: "number" },
        posteriorOdds: { type: "number" },
        posteriorProbability: { type: "number" },
      },
      required: ["priorOdds", "posteriorOdds", "posteriorProbability"],
    },
    ports: {
      inputs: [
        {
          id: "priorProbability",
          label: "Prior Probability",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "likelihoodRatio",
          label: "Likelihood Ratio",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        { id: "priorOdds", label: "Prior Odds", valueType: { type: "number" } },
        {
          id: "posteriorOdds",
          label: "Posterior Odds",
          valueType: { type: "number" },
        },
        {
          id: "posteriorProbability",
          label: "Posterior Probability",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = perceptualChoicePriorOddsShiftTool.execute;
export default perceptualChoicePriorOddsShiftTool;
