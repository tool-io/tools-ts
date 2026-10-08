import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earnedScore: number;
  readonly maximumScore: number;
  readonly assignedWeight: number;
};
export type Output = { readonly weightedContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earnedScore: { type: "number", minimum: 0 },
    maximumScore: { type: "number", exclusiveMinimum: 0 },
    assignedWeight: { type: "number", minimum: 0 },
  },
  required: ["earnedScore", "maximumScore", "assignedWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedContribution: { type: "number" } },
  required: ["weightedContribution"],
} as const;
/** Normalize a recorded item score to its explicitly assigned contribution weight without selecting a grading or psychometric model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earnedScore, maximumScore, assignedWeight } = request;
  const compute = (): Output => {
    (H.domain(maximumScore > 0, "maximumScore"), maximumScore);
    H.domain(
      earnedScore >= 0 && earnedScore <= maximumScore && assignedWeight >= 0,
      "earnedScore",
    );
    return {
      weightedContribution: (earnedScore / maximumScore) * assignedWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earnedScore: 3, maximumScore: 4, assignedWeight: 20 },
  output: { weightedContribution: 15 },
} satisfies ToolExample<Input, Output>;
export const itemScoreMaximumWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "educational-psychology",
        "educational psychology",
        "psychology",
      ],
      keywords: ["educational psychology", "psychology"],
    },
    id: "educational-psychology/item-score-maximum-weight",
    title: "Item Score Maximum Weight",
    description:
      "Normalize a recorded item score to its explicitly assigned contribution weight without selecting a grading or psychometric model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earnedScore: { type: "number", minimum: 0 },
        maximumScore: { type: "number", exclusiveMinimum: 0 },
        assignedWeight: { type: "number", minimum: 0 },
      },
      required: ["earnedScore", "maximumScore", "assignedWeight"],
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
          id: "earnedScore",
          label: "Earned Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumScore",
          label: "Maximum Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assignedWeight",
          label: "Assigned Weight",
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
export const run = itemScoreMaximumWeightTool.execute;
export default itemScoreMaximumWeightTool;
