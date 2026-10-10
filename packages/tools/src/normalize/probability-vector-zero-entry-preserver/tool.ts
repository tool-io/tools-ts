import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly weights: readonly number[] };
export type Output = {
  readonly normalized: readonly number[];
  readonly zeroIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "array", maxItems: 256, items: { type: "number" } },
    zeroIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["normalized", "zeroIndices"],
} as const;
/** Normalize an explicit nonnegative finite weight vector using maximum scaling while preserving exact zero-entry positions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(
        weights.every((value) => value >= 0),
        "weights",
      );
      const scale = Math.max(...weights);
      H.domain(scale > 0, "weights");
      const scaled = weights.map((value) => value / scale),
        sum = scaled.reduce((a, b) => a + b, 0);
      return {
        normalized: scaled.map((value) => value / sum),
        zeroIndices: weights.flatMap((value, i) => (value === 0 ? [i] : [])),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [0, 2, 6] },
  output: { normalized: [0, 0.25, 0.75], zeroIndices: [0] },
} satisfies ToolExample<Input, Output>;
export const probabilityVectorZeroEntryPreserverTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["encode-decode"],
        fields: ["normalize", "data normalization", "computer science"],
        keywords: ["data normalization", "computer science"],
      },
      id: "normalize/probability-vector-zero-entry-preserver",
      title: "Probability Vector Zero Entry Preserver",
      description:
        "Normalize an explicit nonnegative finite weight vector using maximum scaling while preserving exact zero-entry positions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weights: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["weights"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalized: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          zeroIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["normalized", "zeroIndices"],
      },
      ports: {
        inputs: [
          {
            id: "weights",
            label: "Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "zeroIndices",
            label: "Zero Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = probabilityVectorZeroEntryPreserverTool.execute;
export default probabilityVectorZeroEntryPreserverTool;
