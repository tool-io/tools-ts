import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLength: number;
  readonly secondLength: number;
  readonly mismatches: number;
  readonly padMissing: boolean;
};
export type Output = { readonly defined: boolean; readonly similarity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLength: { type: "integer", minimum: 0 },
    secondLength: { type: "integer", minimum: 0 },
    mismatches: { type: "integer", minimum: 0 },
    padMissing: { type: "boolean" },
  },
  required: ["firstLength", "secondLength", "mismatches", "padMissing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, similarity: { type: "number" } },
  required: ["defined", "similarity"],
} as const;
/** Calculate hamming similarity length mismatch policy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLength, secondLength, mismatches, padMissing } = request;
  const compute = (): Output => {
    H.integer(firstLength, 0);
    H.integer(secondLength, 0);
    H.integer(mismatches, 0, Math.min(firstLength, secondLength));
    const defined = padMissing || firstLength === secondLength,
      denominator = Math.max(firstLength, secondLength),
      errors =
        mismatches + (padMissing ? Math.abs(firstLength - secondLength) : 0);
    return {
      defined,
      similarity: !defined
        ? 0
        : denominator === 0
          ? 1
          : 1 - errors / denominator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLength: 3, secondLength: 5, mismatches: 1, padMissing: true },
  output: { defined: true, similarity: 0.4 },
} satisfies ToolExample<Input, Output>;
export const hammingSimilarityLengthMismatchPolicyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/hamming-similarity-length-mismatch-policy",
      title: "Hamming Similarity Length Mismatch Policy Tool",
      description:
        "Calculate hamming similarity length mismatch policy from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstLength: { type: "integer", minimum: 0 },
          secondLength: { type: "integer", minimum: 0 },
          mismatches: { type: "integer", minimum: 0 },
          padMissing: { type: "boolean" },
        },
        required: ["firstLength", "secondLength", "mismatches", "padMissing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          defined: { type: "boolean" },
          similarity: { type: "number" },
        },
        required: ["defined", "similarity"],
      },
      ports: {
        inputs: [
          {
            id: "firstLength",
            label: "First Length",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondLength",
            label: "Second Length",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "mismatches",
            label: "Mismatches",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "padMissing",
            label: "Pad Missing",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
          {
            id: "similarity",
            label: "Similarity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hammingSimilarityLengthMismatchPolicyTool.execute;
export default hammingSimilarityLengthMismatchPolicyTool;
