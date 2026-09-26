import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probability: number;
  readonly probabilityDerivative: number;
};
export type Output = { readonly information: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
    probabilityDerivative: { type: "number" },
  },
  required: ["probability", "probabilityDerivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { information: { type: "number" } },
  required: ["information"],
} as const;
/** Bernoulli item Fisher information from an explicit derivative with respect to the latent parameter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, probabilityDerivative } = request;
  const compute = (): Output => {
    H.domain(probability > 0 && probability < 1);
    return {
      information:
        probabilityDerivative ** 2 / (probability * (1 - probability)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.5, probabilityDerivative: 0.25 },
  output: { information: 0.25 },
} satisfies ToolExample<Input, Output>;
export const testInformationOneItemTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/test-information-one-item-term",
    title: "Test Information One Item Term Tool",
    description:
      "Bernoulli item Fisher information from an explicit derivative with respect to the latent parameter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: {
          type: "number",
          exclusiveMinimum: 0,
          exclusiveMaximum: 1,
        },
        probabilityDerivative: { type: "number" },
      },
      required: ["probability", "probabilityDerivative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { information: { type: "number" } },
      required: ["information"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "probabilityDerivative",
          label: "Probability Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "information",
          label: "Information",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = testInformationOneItemTermTool.execute;
export default testInformationOneItemTermTool;
