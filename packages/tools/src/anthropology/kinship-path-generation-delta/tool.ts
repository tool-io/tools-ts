import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly generationSteps: readonly number[] };
export type Output = { readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generationSteps: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["generationSteps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delta: { type: "integer" } },
  required: ["delta"],
} as const;
/** Sum explicit parent, same-generation and child steps; no cultural kinship terminology is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { generationSteps } = request;
  const compute = (): Output => {
    H.domain(generationSteps.every((x) => [-1, 0, 1].includes(x)));
    return { delta: generationSteps.reduce((a, b) => a + b, 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { generationSteps: [1, 1, -1] },
  output: { delta: 1 },
} satisfies ToolExample<Input, Output>;
export const kinshipPathGenerationDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/kinship-path-generation-delta",
    title: "Kinship Path Generation Delta Tool",
    description:
      "Sum explicit parent, same-generation and child steps; no cultural kinship terminology is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        generationSteps: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["generationSteps"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delta: { type: "integer" } },
      required: ["delta"],
    },
    ports: {
      inputs: [
        {
          id: "generationSteps",
          label: "Generation Steps",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = kinshipPathGenerationDeltaTool.execute;
export default kinshipPathGenerationDeltaTool;
