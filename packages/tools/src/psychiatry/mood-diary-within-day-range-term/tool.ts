import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ratings: readonly number[];
  readonly minimumScale: number;
  readonly maximumScale: number;
};
export type Output = {
  readonly minimum: number;
  readonly maximum: number;
  readonly range: number;
  readonly scaleNormalizedRange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratings: { type: "array", maxItems: 256, items: { type: "number" } },
    minimumScale: { type: "number" },
    maximumScale: { type: "number" },
  },
  required: ["ratings", "minimumScale", "maximumScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimum: { type: "number" },
    maximum: { type: "number" },
    range: { type: "number" },
    scaleNormalizedRange: { type: "number" },
  },
  required: ["minimum", "maximum", "range", "scaleNormalizedRange"],
} as const;
/** Descriptive observed diary range on explicit scale bounds, without a mood-disorder indicator or a threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ratings, minimumScale, maximumScale } = request;
  const compute = (): Output => {
    H.domain(
      ratings.length > 0 &&
        maximumScale > minimumScale &&
        ratings.every((x) => x >= minimumScale && x <= maximumScale),
    );
    return {
      minimum: Math.min(...ratings),
      maximum: Math.max(...ratings),
      range: Math.max(...ratings) - Math.min(...ratings),
      scaleNormalizedRange:
        (Math.max(...ratings) - Math.min(...ratings)) /
        (maximumScale - minimumScale),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ratings: [2, 5, 3], minimumScale: 1, maximumScale: 7 },
  output: { minimum: 2, maximum: 5, range: 3, scaleNormalizedRange: 0.5 },
} satisfies ToolExample<Input, Output>;
export const moodDiaryWithinDayRangeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/mood-diary-within-day-range-term",
    title: "Mood Diary Within Day Range Term Tool",
    description:
      "Descriptive observed diary range on explicit scale bounds, without a mood-disorder indicator or a threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratings: { type: "array", maxItems: 256, items: { type: "number" } },
        minimumScale: { type: "number" },
        maximumScale: { type: "number" },
      },
      required: ["ratings", "minimumScale", "maximumScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimum: { type: "number" },
        maximum: { type: "number" },
        range: { type: "number" },
        scaleNormalizedRange: { type: "number" },
      },
      required: ["minimum", "maximum", "range", "scaleNormalizedRange"],
    },
    ports: {
      inputs: [
        {
          id: "ratings",
          label: "Ratings",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "minimumScale",
          label: "Minimum Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumScale",
          label: "Maximum Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "minimum", label: "Minimum", valueType: { type: "number" } },
        { id: "maximum", label: "Maximum", valueType: { type: "number" } },
        { id: "range", label: "Range", valueType: { type: "number" } },
        {
          id: "scaleNormalizedRange",
          label: "Scale Normalized Range",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = moodDiaryWithinDayRangeTermTool.execute;
export default moodDiaryWithinDayRangeTermTool;
