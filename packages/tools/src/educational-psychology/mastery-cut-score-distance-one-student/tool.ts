import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly cut: number;
  readonly inclusive: boolean;
  readonly maximum: number;
};
export type Output = {
  readonly distance: number;
  readonly mastered: boolean;
  readonly maximumMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    cut: { type: "number" },
    inclusive: { type: "boolean" },
    maximum: { type: "number" },
  },
  required: ["score", "cut", "inclusive", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    mastered: { type: "boolean" },
    maximumMargin: { type: "number" },
  },
  required: ["distance", "mastered", "maximumMargin"],
} as const;
/** Calculate mastery cut score distance one student from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, cut, inclusive, maximum } = request;
  const compute = (): Output => {
    H.domain(maximum >= cut && score <= maximum);
    return {
      distance: score - cut,
      mastered: inclusive ? score >= cut : score > cut,
      maximumMargin: maximum - score,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 75, cut: 70, inclusive: true, maximum: 100 },
  output: { distance: 5, mastered: true, maximumMargin: 25 },
} satisfies ToolExample<Input, Output>;
export const masteryCutScoreDistanceOneStudentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/mastery-cut-score-distance-one-student",
    title: "Mastery Cut Score Distance One Student Tool",
    description:
      "Calculate mastery cut score distance one student from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        cut: { type: "number" },
        inclusive: { type: "boolean" },
        maximum: { type: "number" },
      },
      required: ["score", "cut", "inclusive", "maximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        mastered: { type: "boolean" },
        maximumMargin: { type: "number" },
      },
      required: ["distance", "mastered", "maximumMargin"],
    },
    ports: {
      inputs: [
        {
          id: "score",
          label: "Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cut",
          label: "Cut",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        { id: "mastered", label: "Mastered", valueType: { type: "boolean" } },
        {
          id: "maximumMargin",
          label: "Maximum Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = masteryCutScoreDistanceOneStudentTool.execute;
export default masteryCutScoreDistanceOneStudentTool;
