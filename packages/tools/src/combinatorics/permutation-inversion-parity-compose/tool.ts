import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstOdd: boolean; readonly secondOdd: boolean };
export type Output = { readonly compositionOdd: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { firstOdd: { type: "boolean" }, secondOdd: { type: "boolean" } },
  required: ["firstOdd", "secondOdd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { compositionOdd: { type: "boolean" } },
  required: ["compositionOdd"],
} as const;
/** Compose two explicitly supplied permutation parities using multiplication of signs, represented by Boolean oddness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOdd, secondOdd } = request;
  const compute = (): Output => {
    return { compositionOdd: firstOdd !== secondOdd };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOdd: true, secondOdd: true },
  output: { compositionOdd: false },
} satisfies ToolExample<Input, Output>;
export const permutationInversionParityComposeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["combinatorics", "mathematics"],
      keywords: ["combinatorics", "mathematics"],
    },
    id: "combinatorics/permutation-inversion-parity-compose",
    title: "Permutation Inversion Parity Compose",
    description:
      "Compose two explicitly supplied permutation parities using multiplication of signs, represented by Boolean oddness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOdd: { type: "boolean" },
        secondOdd: { type: "boolean" },
      },
      required: ["firstOdd", "secondOdd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { compositionOdd: { type: "boolean" } },
      required: ["compositionOdd"],
    },
    ports: {
      inputs: [
        {
          id: "firstOdd",
          label: "First Odd",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondOdd",
          label: "Second Odd",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "compositionOdd",
          label: "Composition Odd",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = permutationInversionParityComposeTool.execute;
export default permutationInversionParityComposeTool;
