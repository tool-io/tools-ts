import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly priorOdds: number;
  readonly likelihoodRatio: number;
};
export type Output = {
  readonly posteriorOdds: number;
  readonly posteriorProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorOdds: { type: "number" },
    likelihoodRatio: { type: "number" },
  },
  required: ["priorOdds", "likelihoodRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    posteriorOdds: { type: "number" },
    posteriorProbability: { type: "number" },
  },
  required: ["posteriorOdds", "posteriorProbability"],
} as const;
/** Compute two conditionals bayes odds factor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { priorOdds, likelihoodRatio } = input;
  const compute = (): Output => {
    domain(priorOdds >= 0 && likelihoodRatio >= 0);
    const posteriorOdds = priorOdds * likelihoodRatio;
    return {
      posteriorOdds,
      posteriorProbability: posteriorOdds / (1 + posteriorOdds),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { priorOdds: 1, likelihoodRatio: 3 },
  output: { posteriorOdds: 3, posteriorProbability: 0.75 },
} satisfies ToolExample<Input, Output>;
export const twoConditionalsBayesOddsFactorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "probability/two-conditionals-bayes-odds-factor",
  title: "Two Conditionals Bayes Odds Factor Tool",
  description:
    "Compute two conditionals bayes odds factor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "priorOdds",
        label: "Prior Odds",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "likelihoodRatio",
        label: "Likelihood Ratio",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "posteriorOdds",
        label: "Posterior Odds",
        valueType: { type: "number" },
      },
      {
        id: "posteriorProbability",
        label: "Posterior Probability",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = twoConditionalsBayesOddsFactorTool.execute;
export default twoConditionalsBayesOddsFactorTool;
