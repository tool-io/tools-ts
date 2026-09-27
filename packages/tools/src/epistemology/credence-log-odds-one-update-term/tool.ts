import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorLogOdds: number;
  readonly logLikelihoodRatio: number;
};
export type Output = {
  readonly posteriorLogOdds: number;
  readonly posterior: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorLogOdds: { type: "number" },
    logLikelihoodRatio: { type: "number" },
  },
  required: ["priorLogOdds", "logLikelihoodRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    posteriorLogOdds: { type: "number" },
    posterior: { type: "number" },
  },
  required: ["posteriorLogOdds", "posterior"],
} as const;
/** Stable binary Bayesian update from finite log odds and log likelihood ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorLogOdds, logLikelihoodRatio } = request;
  const compute = (): Output => {
    return {
      posteriorLogOdds: priorLogOdds + logLikelihoodRatio,
      posterior:
        priorLogOdds + logLikelihoodRatio >= 0
          ? 1 / (1 + Math.exp(-priorLogOdds - logLikelihoodRatio))
          : Math.exp(priorLogOdds + logLikelihoodRatio) /
            (1 + Math.exp(priorLogOdds + logLikelihoodRatio)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priorLogOdds: 0, logLikelihoodRatio: 1.0986122886681096 },
  output: {
    posteriorLogOdds: 1.0986122886681096,
    posterior: 0.7499999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const credenceLogOddsOneUpdateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/credence-log-odds-one-update-term",
    title: "Credence Log Odds One Update Term Tool",
    description:
      "Stable binary Bayesian update from finite log odds and log likelihood ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorLogOdds: { type: "number" },
        logLikelihoodRatio: { type: "number" },
      },
      required: ["priorLogOdds", "logLikelihoodRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        posteriorLogOdds: { type: "number" },
        posterior: { type: "number" },
      },
      required: ["posteriorLogOdds", "posterior"],
    },
    ports: {
      inputs: [
        {
          id: "priorLogOdds",
          label: "Prior Log Odds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logLikelihoodRatio",
          label: "Log Likelihood Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "posteriorLogOdds",
          label: "Posterior Log Odds",
          valueType: { type: "number" },
        },
        { id: "posterior", label: "Posterior", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = credenceLogOddsOneUpdateTermTool.execute;
export default credenceLogOddsOneUpdateTermTool;
