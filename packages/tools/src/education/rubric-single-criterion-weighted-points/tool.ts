import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earnedPoints: number;
  readonly possiblePoints: number;
  readonly criterionWeight: number;
};
export type Output = { readonly weightedContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earnedPoints: { type: "number", minimum: 0 },
    possiblePoints: { type: "number", exclusiveMinimum: 0 },
    criterionWeight: { type: "number", minimum: 0 },
  },
  required: ["earnedPoints", "possiblePoints", "criterionWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedContribution: { type: "number" } },
  required: ["weightedContribution"],
} as const;
/** Convert one rubric criterion's earned fraction into its explicit weighted contribution without assigning a grade threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earnedPoints, possiblePoints, criterionWeight } = request;
  const compute = (): Output => {
    (H.domain(possiblePoints > 0, "possiblePoints"), possiblePoints);
    H.domain(
      earnedPoints >= 0 &&
        earnedPoints <= possiblePoints &&
        criterionWeight >= 0,
      "earnedPoints",
    );
    return {
      weightedContribution: (earnedPoints / possiblePoints) * criterionWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earnedPoints: 8, possiblePoints: 10, criterionWeight: 25 },
  output: { weightedContribution: 20 },
} satisfies ToolExample<Input, Output>;
export const rubricSingleCriterionWeightedPointsTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "education/rubric-single-criterion-weighted-points",
      title: "Rubric Single Criterion Weighted Points Tool",
      description:
        "Convert one rubric criterion's earned fraction into its explicit weighted contribution without assigning a grade threshold.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          earnedPoints: { type: "number", minimum: 0 },
          possiblePoints: { type: "number", exclusiveMinimum: 0 },
          criterionWeight: { type: "number", minimum: 0 },
        },
        required: ["earnedPoints", "possiblePoints", "criterionWeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { weightedContribution: { type: "number" } },
        required: ["weightedContribution"],
      },
      ports: {
        inputs: [
          {
            id: "earnedPoints",
            label: "Earned Points",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "possiblePoints",
            label: "Possible Points",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "criterionWeight",
            label: "Criterion Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "weightedContribution",
            label: "Weighted Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rubricSingleCriterionWeightedPointsTool.execute;
export default rubricSingleCriterionWeightedPointsTool;
