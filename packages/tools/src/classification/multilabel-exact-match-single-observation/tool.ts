import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly actual: readonly string[];
  readonly predicted: readonly string[];
};
export type Output = {
  readonly match: boolean;
  readonly missing: readonly string[];
  readonly extra: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    predicted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["actual", "predicted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    match: { type: "boolean" },
    missing: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    extra: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["match", "missing", "extra"],
} as const;
/** Compute multilabel exact match single observation from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { actual, predicted } = input;
  const compute = (): Output => {
    const a = new Set(actual),
      b = new Set(predicted),
      missing = [...a].filter((x) => !b.has(x)),
      extra = [...b].filter((x) => !a.has(x));
    return { match: missing.length + extra.length === 0, missing, extra };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { actual: ["a", "b"], predicted: ["a", "c"] },
  output: { match: false, missing: ["b"], extra: ["c"] },
} satisfies ToolExample<Input, Output>;
export const multilabelExactMatchSingleObservationTool =
  defineSchemaCalculation<Input, Output>({
    id: "classification/multilabel-exact-match-single-observation",
    title: "Multilabel Exact Match Single Observation Tool",
    description:
      "Compute multilabel exact match single observation from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "predicted",
          label: "Predicted",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "match", label: "Match", valueType: { type: "boolean" } },
        {
          id: "missing",
          label: "Missing",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "extra",
          label: "Extra",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  });
export const run = multilabelExactMatchSingleObservationTool.execute;
export default multilabelExactMatchSingleObservationTool;
