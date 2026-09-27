import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly prior: number; readonly posterior: number };
export type Output = {
  readonly difference: number;
  readonly relativeIncrease: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prior: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    posterior: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["prior", "posterior"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    relativeIncrease: { type: "number" },
  },
  required: ["difference", "relativeIncrease"],
} as const;
/** Difference confirmation P(H|E)-P(H) and change relative to a nonzero prior, not a likelihood ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prior, posterior } = request;
  const compute = (): Output => {
    H.domain(prior > 0 && prior <= 1);
    H.probability(posterior);
    return {
      difference: posterior - prior,
      relativeIncrease: (posterior - prior) / prior,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prior: 0.2, posterior: 0.5 },
  output: { difference: 0.3, relativeIncrease: 1.4999999999999998 },
} satisfies ToolExample<Input, Output>;
export const bayesianConfirmationPriorPosteriorGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epistemology/bayesian-confirmation-prior-posterior-gap",
      title: "Bayesian Confirmation Prior Posterior Gap Tool",
      description:
        "Difference confirmation P(H|E)-P(H) and change relative to a nonzero prior, not a likelihood ratio.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prior: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          posterior: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["prior", "posterior"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          difference: { type: "number" },
          relativeIncrease: { type: "number" },
        },
        required: ["difference", "relativeIncrease"],
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
            id: "posterior",
            label: "Posterior",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "difference",
            label: "Difference",
            valueType: { type: "number" },
          },
          {
            id: "relativeIncrease",
            label: "Relative Increase",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = bayesianConfirmationPriorPosteriorGapTool.execute;
export default bayesianConfirmationPriorPosteriorGapTool;
