import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly distance: number;
  readonly leftLength: number;
  readonly rightLength: number;
};
export type Output = { readonly valid: boolean; readonly similarity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "integer", minimum: 0 },
    leftLength: { type: "integer", minimum: 0 },
    rightLength: { type: "integer", minimum: 0 },
  },
  required: ["distance", "leftLength", "rightLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" }, similarity: { type: "number" } },
  required: ["valid", "similarity"],
} as const;
/** Compute normalized edit similarity endpoint check from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { distance, leftLength, rightLength } = input;
  const compute = (): Output => {
    integer(distance);
    integer(leftLength);
    integer(rightLength);
    const size = Math.max(leftLength, rightLength),
      valid =
        distance >= Math.abs(leftLength - rightLength) && distance <= size;
    domain(valid);
    return { valid, similarity: size === 0 ? 1 : 1 - distance / size };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { distance: 0, leftLength: 0, rightLength: 0 },
  output: { valid: true, similarity: 1 },
} satisfies ToolExample<Input, Output>;
export const normalizedEditSimilarityEndpointCheckTool =
  defineSchemaCalculation<Input, Output>({
    id: "similarity/normalized-edit-similarity-endpoint-check",
    title: "Normalized Edit Similarity Endpoint Check Tool",
    description:
      "Compute normalized edit similarity endpoint check from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leftLength",
          label: "Left Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rightLength",
          label: "Right Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        {
          id: "similarity",
          label: "Similarity",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = normalizedEditSimilarityEndpointCheckTool.execute;
export default normalizedEditSimilarityEndpointCheckTool;
