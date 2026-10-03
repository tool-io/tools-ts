import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cardinality: number;
  readonly alreadyMember: boolean;
};
export type Output = { readonly cardinality: number; readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cardinality: { type: "integer", minimum: 0 },
    alreadyMember: { type: "boolean" },
  },
  required: ["cardinality", "alreadyMember"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cardinality: { type: "integer" }, delta: { type: "integer" } },
  required: ["cardinality", "delta"],
} as const;
/** Calculate set union one element cardinality delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cardinality, alreadyMember } = request;
  const compute = (): Output => {
    H.integer(cardinality, 0);
    H.domain(!alreadyMember || cardinality > 0);
    const delta = alreadyMember ? 0 : 1;
    return { cardinality: cardinality + delta, delta };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cardinality: 5, alreadyMember: false },
  output: { cardinality: 6, delta: 1 },
} satisfies ToolExample<Input, Output>;
export const setUnionOneElementCardinalityDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-union-one-element-cardinality-delta",
    title: "Set Union One Element Cardinality Delta Tool",
    description:
      "Calculate set union one element cardinality delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cardinality: { type: "integer", minimum: 0 },
        alreadyMember: { type: "boolean" },
      },
      required: ["cardinality", "alreadyMember"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cardinality: { type: "integer" },
        delta: { type: "integer" },
      },
      required: ["cardinality", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "cardinality",
          label: "Cardinality",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "alreadyMember",
          label: "Already Member",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "cardinality",
          label: "Cardinality",
          valueType: { type: "integer" },
        },
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = setUnionOneElementCardinalityDeltaTool.execute;
export default setUnionOneElementCardinalityDeltaTool;
