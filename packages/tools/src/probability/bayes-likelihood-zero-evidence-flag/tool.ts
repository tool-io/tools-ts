import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prior: number;
  readonly likelihood: number;
  readonly complementLikelihood: number;
};
export type Output = {
  readonly evidence: number;
  readonly posteriorDefined: boolean;
  readonly posterior: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prior: { type: "number", minimum: 0, maximum: 1 },
    likelihood: { type: "number", minimum: 0, maximum: 1 },
    complementLikelihood: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["prior", "likelihood", "complementLikelihood"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evidence: { type: "number" },
    posteriorDefined: { type: "boolean" },
    posterior: { type: "number" },
  },
  required: ["evidence", "posteriorDefined", "posterior"],
} as const;
/** Binary Bayes update with impossible evidence flagged and a zero posterior placeholder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prior, likelihood, complementLikelihood } = request;
  const compute = (): Output => {
    H.probability(prior);
    H.probability(likelihood);
    H.probability(complementLikelihood);
    return {
      evidence: prior * likelihood + (1 - prior) * complementLikelihood,
      posteriorDefined:
        prior * likelihood + (1 - prior) * complementLikelihood > 0,
      posterior:
        prior * likelihood + (1 - prior) * complementLikelihood > 0
          ? (prior * likelihood) /
            (prior * likelihood + (1 - prior) * complementLikelihood)
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prior: 0.5, likelihood: 0, complementLikelihood: 0 },
  output: { evidence: 0, posteriorDefined: false, posterior: 0 },
} satisfies ToolExample<Input, Output>;
export const bayesLikelihoodZeroEvidenceFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/bayes-likelihood-zero-evidence-flag",
    title: "Bayes Likelihood Zero Evidence Flag Tool",
    description:
      "Binary Bayes update with impossible evidence flagged and a zero posterior placeholder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prior: { type: "number", minimum: 0, maximum: 1 },
        likelihood: { type: "number", minimum: 0, maximum: 1 },
        complementLikelihood: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["prior", "likelihood", "complementLikelihood"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evidence: { type: "number" },
        posteriorDefined: { type: "boolean" },
        posterior: { type: "number" },
      },
      required: ["evidence", "posteriorDefined", "posterior"],
    },
    ports: {
      inputs: [
        {
          id: "prior",
          label: "Prior",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "likelihood",
          label: "Likelihood",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "complementLikelihood",
          label: "Complement Likelihood",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "evidence", label: "Evidence", valueType: { type: "number" } },
        {
          id: "posteriorDefined",
          label: "Posterior Defined",
          valueType: { type: "boolean" },
        },
        { id: "posterior", label: "Posterior", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bayesLikelihoodZeroEvidenceFlagTool.execute;
export default bayesLikelihoodZeroEvidenceFlagTool;
