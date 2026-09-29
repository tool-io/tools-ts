import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceEdition: string;
  readonly authorizedEdition: string;
  readonly reviewedAt: number;
  readonly evaluationAt: number;
  readonly suppliedReviewPeriod: number;
};
export type Output = {
  readonly editionMatches: boolean;
  readonly age: number;
  readonly reviewMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceEdition: { type: "string", maxLength: 8192 },
    authorizedEdition: { type: "string", maxLength: 8192 },
    reviewedAt: { type: "number" },
    evaluationAt: { type: "number" },
    suppliedReviewPeriod: { type: "number", minimum: 0 },
  },
  required: [
    "sourceEdition",
    "authorizedEdition",
    "reviewedAt",
    "evaluationAt",
    "suppliedReviewPeriod",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionMatches: { type: "boolean" },
    age: { type: "number" },
    reviewMargin: { type: "number" },
  },
  required: ["editionMatches", "age", "reviewMargin"],
} as const;
/** Compare explicit authorization edition and review metadata; permission is supplied, never inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourceEdition,
    authorizedEdition,
    reviewedAt,
    evaluationAt,
    suppliedReviewPeriod,
  } = request;
  const compute = (): Output => {
    H.domain(evaluationAt >= reviewedAt && suppliedReviewPeriod >= 0);
    return {
      editionMatches: sourceEdition === authorizedEdition,
      age: evaluationAt - reviewedAt,
      reviewMargin: suppliedReviewPeriod - (evaluationAt - reviewedAt),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceEdition: "v2",
    authorizedEdition: "v2",
    reviewedAt: 10,
    evaluationAt: 16,
    suppliedReviewPeriod: 5,
  },
  output: { editionMatches: true, age: 6, reviewMargin: -1 },
} satisfies ToolExample<Input, Output>;
export const authorizedSourceReviewPeriodGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/authorized-source-review-period-gap",
    title: "Authorized Source Review Period Gap Tool",
    description:
      "Compare explicit authorization edition and review metadata; permission is supplied, never inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceEdition: { type: "string", maxLength: 8192 },
        authorizedEdition: { type: "string", maxLength: 8192 },
        reviewedAt: { type: "number" },
        evaluationAt: { type: "number" },
        suppliedReviewPeriod: { type: "number", minimum: 0 },
      },
      required: [
        "sourceEdition",
        "authorizedEdition",
        "reviewedAt",
        "evaluationAt",
        "suppliedReviewPeriod",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        editionMatches: { type: "boolean" },
        age: { type: "number" },
        reviewMargin: { type: "number" },
      },
      required: ["editionMatches", "age", "reviewMargin"],
    },
    ports: {
      inputs: [
        {
          id: "sourceEdition",
          label: "Source Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorizedEdition",
          label: "Authorized Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reviewedAt",
          label: "Reviewed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaluationAt",
          label: "Evaluation At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReviewPeriod",
          label: "Supplied Review Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "editionMatches",
          label: "Edition Matches",
          valueType: { type: "boolean" },
        },
        { id: "age", label: "Age", valueType: { type: "number" } },
        {
          id: "reviewMargin",
          label: "Review Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedSourceReviewPeriodGapTool.execute;
export default authorizedSourceReviewPeriodGapTool;
