import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rating: number;
  readonly lowerBound: number;
  readonly upperBound: number;
};
export type Output = { readonly fractionalPosition: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rating: { type: "number" },
    lowerBound: { type: "number" },
    upperBound: { type: "number" },
  },
  required: ["rating", "lowerBound", "upperBound"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fractionalPosition: { type: "number" } },
  required: ["fractionalPosition"],
} as const;
/** Normalize an explicit platform rating within supplied scale bounds without comparing platform populations or rating quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rating, lowerBound, upperBound } = request;
  const compute = (): Output => {
    H.domain(
      upperBound > lowerBound && rating >= lowerBound && rating <= upperBound,
      "upperBound",
    );
    return {
      fractionalPosition: (rating - lowerBound) / (upperBound - lowerBound),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rating: 4, lowerBound: 1, upperBound: 5 },
  output: { fractionalPosition: 0.75 },
} satisfies ToolExample<Input, Output>;
export const mediaRatingPlatformScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["media-studies", "media studies", "social sciences"],
      keywords: ["media studies", "social sciences"],
    },
    id: "media-studies/media-rating-platform-scale",
    title: "Media Rating Platform Scale",
    description:
      "Normalize an explicit platform rating within supplied scale bounds without comparing platform populations or rating quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rating: { type: "number" },
        lowerBound: { type: "number" },
        upperBound: { type: "number" },
      },
      required: ["rating", "lowerBound", "upperBound"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fractionalPosition: { type: "number" } },
      required: ["fractionalPosition"],
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
          id: "lowerBound",
          label: "Lower Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fractionalPosition",
          label: "Fractional Position",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mediaRatingPlatformScaleTool.execute;
export default mediaRatingPlatformScaleTool;
