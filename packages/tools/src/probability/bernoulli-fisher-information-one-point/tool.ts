import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number };
export type Output = { readonly information: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", exclusiveMinimum: 0, exclusiveMaximum: 1 },
  },
  required: ["probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { information: { type: "number" } },
  required: ["information"],
} as const;
/** Calculate bernoulli fisher information one point from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { probability } = input;
  const compute = (): Output => {
    H.domain(probability > 0 && probability < 1);
    return { information: 1 / (probability * (1 - probability)) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { probability: 0.5 },
  output: { information: 4 },
} satisfies ToolExample<Input, Output>;
export const bernoulliFisherInformationOnePointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/bernoulli-fisher-information-one-point",
    title: "Bernoulli Fisher Information One Point Tool",
    description:
      "Calculate bernoulli fisher information one point from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: {
          type: "number",
          exclusiveMinimum: 0,
          exclusiveMaximum: 1,
        },
      },
      required: ["probability"],
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
export const run = bernoulliFisherInformationOnePointTool.execute;
export default bernoulliFisherInformationOnePointTool;
