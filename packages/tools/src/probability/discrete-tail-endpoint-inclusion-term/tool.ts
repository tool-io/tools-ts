import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly strictTail: number;
  readonly endpointMass: number;
};
export type Output = { readonly inclusiveTail: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strictTail: { type: "number", minimum: 0, maximum: 1 },
    endpointMass: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["strictTail", "endpointMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inclusiveTail: { type: "number" } },
  required: ["inclusiveTail"],
} as const;
/** Calculate discrete tail endpoint inclusion term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { strictTail, endpointMass } = input;
  const compute = (): Output => {
    H.probability(strictTail);
    H.probability(endpointMass);
    H.domain(strictTail + endpointMass <= 1);
    return { inclusiveTail: strictTail + endpointMass };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { strictTail: 0.25, endpointMass: 0.125 },
  output: { inclusiveTail: 0.375 },
} satisfies ToolExample<Input, Output>;
export const discreteTailEndpointInclusionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/discrete-tail-endpoint-inclusion-term",
    title: "Discrete Tail Endpoint Inclusion Term Tool",
    description:
      "Calculate discrete tail endpoint inclusion term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strictTail: { type: "number", minimum: 0, maximum: 1 },
        endpointMass: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["strictTail", "endpointMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inclusiveTail: { type: "number" } },
      required: ["inclusiveTail"],
    },
    ports: {
      inputs: [
        {
          id: "strictTail",
          label: "Strict Tail",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endpointMass",
          label: "Endpoint Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "inclusiveTail",
          label: "Inclusive Tail",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = discreteTailEndpointInclusionTermTool.execute;
export default discreteTailEndpointInclusionTermTool;
