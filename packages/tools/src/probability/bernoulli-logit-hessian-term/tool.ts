import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number };
export type Output = { readonly hessian: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { probability: { type: "number", minimum: 0, maximum: 1 } },
  required: ["probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { hessian: { type: "number" } },
  required: ["hessian"],
} as const;
/** Return the log-likelihood Hessian with respect to a Bernoulli logit at a supplied probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability } = request;
  const compute = (): Output => {
    H.probability(probability);
    return { hessian: -probability * (1 - probability) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.5 },
  output: { hessian: -0.25 },
} satisfies ToolExample<Input, Output>;
export const bernoulliLogitHessianTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/bernoulli-logit-hessian-term",
    title: "Bernoulli Logit Hessian Term Tool",
    description:
      "Return the log-likelihood Hessian with respect to a Bernoulli logit at a supplied probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { probability: { type: "number", minimum: 0, maximum: 1 } },
      required: ["probability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { hessian: { type: "number" } },
      required: ["hessian"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "hessian", label: "Hessian", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bernoulliLogitHessianTermTool.execute;
export default bernoulliLogitHessianTermTool;
