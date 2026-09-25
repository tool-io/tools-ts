import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly sourceHigherIsMore: boolean;
  readonly targetHigherIsMore: boolean;
};
export type Output = {
  readonly mappedScore: number;
  readonly reversed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    minimum: { type: "number" },
    maximum: { type: "number" },
    sourceHigherIsMore: { type: "boolean" },
    targetHigherIsMore: { type: "boolean" },
  },
  required: [
    "score",
    "minimum",
    "maximum",
    "sourceHigherIsMore",
    "targetHigherIsMore",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mappedScore: { type: "number" },
    reversed: { type: "boolean" },
  },
  required: ["mappedScore", "reversed"],
} as const;
/** Direction harmonization on a shared numeric range, without linking different instruments or estimating comparability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, minimum, maximum, sourceHigherIsMore, targetHigherIsMore } =
    request;
  const compute = (): Output => {
    H.domain(maximum > minimum && score >= minimum && score <= maximum);
    return {
      mappedScore:
        sourceHigherIsMore === targetHigherIsMore
          ? score
          : minimum + maximum - score,
      reversed: sourceHigherIsMore !== targetHigherIsMore,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    score: 2,
    minimum: 1,
    maximum: 5,
    sourceHigherIsMore: true,
    targetHigherIsMore: false,
  },
  output: { mappedScore: 4, reversed: true },
} satisfies ToolExample<Input, Output>;
export const developmentRatingScaleDirectionCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/development-rating-scale-direction-crosswalk",
      title: "Development Rating Scale Direction Crosswalk Tool",
      description:
        "Direction harmonization on a shared numeric range, without linking different instruments or estimating comparability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          score: { type: "number" },
          minimum: { type: "number" },
          maximum: { type: "number" },
          sourceHigherIsMore: { type: "boolean" },
          targetHigherIsMore: { type: "boolean" },
        },
        required: [
          "score",
          "minimum",
          "maximum",
          "sourceHigherIsMore",
          "targetHigherIsMore",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mappedScore: { type: "number" },
          reversed: { type: "boolean" },
        },
        required: ["mappedScore", "reversed"],
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
          {
            id: "sourceHigherIsMore",
            label: "Source Higher Is More",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "targetHigherIsMore",
            label: "Target Higher Is More",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "mappedScore",
            label: "Mapped Score",
            valueType: { type: "number" },
          },
          { id: "reversed", label: "Reversed", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = developmentRatingScaleDirectionCrosswalkTool.execute;
export default developmentRatingScaleDirectionCrosswalkTool;
