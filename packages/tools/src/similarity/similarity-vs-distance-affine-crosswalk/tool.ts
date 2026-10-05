import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly similarity: number;
  readonly maximumSimilarity: number;
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    similarity: { type: "number" },
    maximumSimilarity: { type: "number" },
  },
  required: ["similarity", "maximumSimilarity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Apply an explicit affine similarity-to-dissimilarity convention d = maximumSimilarity - similarity; no metric property is asserted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { similarity, maximumSimilarity } = request;
  const compute = (): Output => {
    return { distance: maximumSimilarity - similarity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { similarity: 0.7, maximumSimilarity: 1 },
  output: { distance: 0.30000000000000004 },
} satisfies ToolExample<Input, Output>;
export const similarityVsDistanceAffineCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/similarity-vs-distance-affine-crosswalk",
      title: "Similarity Vs Distance Affine Crosswalk Tool",
      description:
        "Apply an explicit affine similarity-to-dissimilarity convention d = maximumSimilarity - similarity; no metric property is asserted.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          similarity: { type: "number" },
          maximumSimilarity: { type: "number" },
        },
        required: ["similarity", "maximumSimilarity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { distance: { type: "number" } },
        required: ["distance"],
      },
      ports: {
        inputs: [
          {
            id: "similarity",
            label: "Similarity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximumSimilarity",
            label: "Maximum Similarity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "distance", label: "Distance", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = similarityVsDistanceAffineCrosswalkTool.execute;
export default similarityVsDistanceAffineCrosswalkTool;
