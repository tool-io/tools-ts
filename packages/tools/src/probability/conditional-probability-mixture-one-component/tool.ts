import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly weight: number; readonly conditional: number };
export type Output = { readonly jointContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weight: { type: "number", minimum: 0, maximum: 1 },
    conditional: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["weight", "conditional"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { jointContribution: { type: "number" } },
  required: ["jointContribution"],
} as const;
/** Calculate conditional probability mixture one component from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { weight, conditional } = input;
  const compute = (): Output => {
    H.probability(weight);
    H.probability(conditional);
    return { jointContribution: weight * conditional };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { weight: 0.25, conditional: 0.8 },
  output: { jointContribution: 0.2 },
} satisfies ToolExample<Input, Output>;
export const conditionalProbabilityMixtureOneComponentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "probability/conditional-probability-mixture-one-component",
      title: "Conditional Probability Mixture One Component Tool",
      description:
        "Calculate conditional probability mixture one component from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weight: { type: "number", minimum: 0, maximum: 1 },
          conditional: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["weight", "conditional"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { jointContribution: { type: "number" } },
        required: ["jointContribution"],
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
            id: "conditional",
            label: "Conditional",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "jointContribution",
            label: "Joint Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = conditionalProbabilityMixtureOneComponentTool.execute;
export default conditionalProbabilityMixtureOneComponentTool;
