import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weight: number;
  readonly likelihood: number;
  readonly marginal: number;
};
export type Output = { readonly responsibility: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weight: { type: "number", minimum: 0, maximum: 1 },
    likelihood: { type: "number", minimum: 0 },
    marginal: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["weight", "likelihood", "marginal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { responsibility: { type: "number" } },
  required: ["responsibility"],
} as const;
/** Calculate mixture responsibility one component from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weight, likelihood, marginal } = request;
  const compute = (): Output => {
    H.probability(weight);
    H.domain(likelihood >= 0);
    H.positive(marginal);
    H.domain(weight * likelihood <= marginal);
    return { responsibility: (weight * likelihood) / marginal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weight: 0.25, likelihood: 0.8, marginal: 0.4 },
  output: { responsibility: 0.5 },
} satisfies ToolExample<Input, Output>;
export const mixtureResponsibilityOneComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/mixture-responsibility-one-component",
    title: "Mixture Responsibility One Component Tool",
    description:
      "Calculate mixture responsibility one component from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weight: { type: "number", minimum: 0, maximum: 1 },
        likelihood: { type: "number", minimum: 0 },
        marginal: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["weight", "likelihood", "marginal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { responsibility: { type: "number" } },
      required: ["responsibility"],
    },
    ports: {
      inputs: [
        {
          id: "weight",
          label: "Weight",
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
          id: "marginal",
          label: "Marginal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "responsibility",
          label: "Responsibility",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mixtureResponsibilityOneComponentTool.execute;
export default mixtureResponsibilityOneComponentTool;
