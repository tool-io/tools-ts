import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = { readonly probability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", minimum: 0, maximum: 1 },
    second: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { probability: { type: "number" } },
  required: ["probability"],
} as const;
/** Calculate independent event xor probability from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.probability(first);
    H.probability(second);
    return { probability: first * (1 - second) + second * (1 - first) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 0.25, second: 0.5 },
  output: { probability: 0.5 },
} satisfies ToolExample<Input, Output>;
export const independentEventXorProbabilityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/independent-event-xor-probability",
    title: "Independent Event Xor Probability Tool",
    description:
      "Calculate independent event xor probability from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", minimum: 0, maximum: 1 },
        second: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { probability: { type: "number" } },
      required: ["probability"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "probability",
          label: "Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = independentEventXorProbabilityTool.execute;
export default independentEventXorProbabilityTool;
