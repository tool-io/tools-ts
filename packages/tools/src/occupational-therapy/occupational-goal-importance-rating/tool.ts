import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goalId: string;
  readonly reportedRating: number;
  readonly lowerBound: number;
  readonly upperBound: number;
};
export type Output = {
  readonly label: string;
  readonly fractionalPosition: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goalId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedRating: { type: "number" },
    lowerBound: { type: "number" },
    upperBound: { type: "number" },
  },
  required: ["goalId", "reportedRating", "lowerBound", "upperBound"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    fractionalPosition: { type: "number" },
  },
  required: ["label", "fractionalPosition"],
} as const;
/** Record an explicitly reported occupational-goal importance rating under supplied scale bounds without judging priorities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goalId, reportedRating, lowerBound, upperBound } = request;
  const compute = (): Output => {
    H.domain(goalId.length > 0, "goalId");
    H.domain(
      upperBound > lowerBound &&
        reportedRating >= lowerBound &&
        reportedRating <= upperBound,
      "upperBound",
    );
    return {
      label: goalId + "; reported importance=" + reportedRating,
      fractionalPosition:
        (reportedRating - lowerBound) / (upperBound - lowerBound),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { goalId: "G17", reportedRating: 7, lowerBound: 1, upperBound: 9 },
  output: { label: "G17; reported importance=7", fractionalPosition: 0.75 },
} satisfies ToolExample<Input, Output>;
export const occupationalGoalImportanceRatingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-therapy",
        "occupational therapy",
        "health and medicine",
      ],
      keywords: ["occupational therapy", "health and medicine"],
    },
    id: "occupational-therapy/occupational-goal-importance-rating",
    title: "Occupational Goal Importance Rating",
    description:
      "Record an explicitly reported occupational-goal importance rating under supplied scale bounds without judging priorities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goalId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedRating: { type: "number" },
        lowerBound: { type: "number" },
        upperBound: { type: "number" },
      },
      required: ["goalId", "reportedRating", "lowerBound", "upperBound"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        fractionalPosition: { type: "number" },
      },
      required: ["label", "fractionalPosition"],
    },
    ports: {
      inputs: [
        {
          id: "goalId",
          label: "Goal Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedRating",
          label: "Reported Rating",
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
        { id: "label", label: "Label", valueType: { type: "string" } },
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
export const run = occupationalGoalImportanceRatingTool.execute;
export default occupationalGoalImportanceRatingTool;
