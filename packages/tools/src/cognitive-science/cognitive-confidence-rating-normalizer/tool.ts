import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rating: number;
  readonly minimum: number;
  readonly maximum: number;
};
export type Output = { readonly normalizedRating: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rating: { type: "number" },
    minimum: { type: "number" },
    maximum: { type: "number" },
  },
  required: ["rating", "minimum", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedRating: { type: "number" } },
  required: ["normalizedRating"],
} as const;
/** Map a supplied bounded confidence rating to [0,1] without treating the normalized rating as calibrated probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rating, minimum, maximum } = request;
  const compute = (): Output => {
    H.domain(
      minimum < maximum && rating >= minimum && rating <= maximum,
      "minimum",
    );
    return { normalizedRating: (rating - minimum) / (maximum - minimum) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rating: 4, minimum: 1, maximum: 5 },
  output: { normalizedRating: 0.75 },
} satisfies ToolExample<Input, Output>;
export const cognitiveConfidenceRatingNormalizerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cognitive-science", "cognitive science", "psychology"],
        keywords: ["cognitive science", "psychology"],
      },
      id: "cognitive-science/cognitive-confidence-rating-normalizer",
      title: "Cognitive Confidence Rating Normalizer",
      description:
        "Map a supplied bounded confidence rating to [0,1] without treating the normalized rating as calibrated probability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rating: { type: "number" },
          minimum: { type: "number" },
          maximum: { type: "number" },
        },
        required: ["rating", "minimum", "maximum"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { normalizedRating: { type: "number" } },
        required: ["normalizedRating"],
      },
      ports: {
        inputs: [
          {
            id: "rating",
            label: "Rating",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimum",
            label: "Minimum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximum",
            label: "Maximum",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "normalizedRating",
            label: "Normalized Rating",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cognitiveConfidenceRatingNormalizerTool.execute;
export default cognitiveConfidenceRatingNormalizerTool;
