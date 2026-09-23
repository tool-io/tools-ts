import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordCreatedDate: string;
  readonly lastReviewDate: string;
  readonly evaluationDate: string;
  readonly suppliedReviewDays: number;
};
export type Output = {
  readonly recordAgeDays: number;
  readonly reviewAgeDays: number;
  readonly reviewMarginDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordCreatedDate: { type: "string", maxLength: 8192 },
    lastReviewDate: { type: "string", maxLength: 8192 },
    evaluationDate: { type: "string", maxLength: 8192 },
    suppliedReviewDays: { type: "integer", minimum: 0 },
  },
  required: [
    "recordCreatedDate",
    "lastReviewDate",
    "evaluationDate",
    "suppliedReviewDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordAgeDays: { type: "integer" },
    reviewAgeDays: { type: "integer" },
    reviewMarginDays: { type: "integer" },
  },
  required: ["recordAgeDays", "reviewAgeDays", "reviewMarginDays"],
} as const;
/** Inspect supplied protective record-review dates and intervals; no laboratory procedures or compliance judgment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordCreatedDate,
    lastReviewDate,
    evaluationDate,
    suppliedReviewDays,
  } = request;
  const compute = (): Output => {
    H.integer(suppliedReviewDays, 0);
    return (() => {
      const a = H.dateOnly(recordCreatedDate).getTime(),
        b = H.dateOnly(lastReviewDate).getTime(),
        c = H.dateOnly(evaluationDate).getTime();
      H.domain(a <= b && b <= c);
      const reviewAgeDays = (c - b) / 86400000;
      return {
        recordAgeDays: (c - a) / 86400000,
        reviewAgeDays,
        reviewMarginDays: suppliedReviewDays - reviewAgeDays,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordCreatedDate: "2024-01-01",
    lastReviewDate: "2024-01-03",
    evaluationDate: "2024-01-08",
    suppliedReviewDays: 4,
  },
  output: { recordAgeDays: 7, reviewAgeDays: 5, reviewMarginDays: -1 },
} satisfies ToolExample<Input, Output>;
export const protectiveRecordReviewGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/protective-record-review-gap",
    title: "Protective Record Review Gap Tool",
    description:
      "Inspect supplied protective record-review dates and intervals; no laboratory procedures or compliance judgment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordCreatedDate: { type: "string", maxLength: 8192 },
        lastReviewDate: { type: "string", maxLength: 8192 },
        evaluationDate: { type: "string", maxLength: 8192 },
        suppliedReviewDays: { type: "integer", minimum: 0 },
      },
      required: [
        "recordCreatedDate",
        "lastReviewDate",
        "evaluationDate",
        "suppliedReviewDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordAgeDays: { type: "integer" },
        reviewAgeDays: { type: "integer" },
        reviewMarginDays: { type: "integer" },
      },
      required: ["recordAgeDays", "reviewAgeDays", "reviewMarginDays"],
    },
    ports: {
      inputs: [
        {
          id: "recordCreatedDate",
          label: "Record Created Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lastReviewDate",
          label: "Last Review Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evaluationDate",
          label: "Evaluation Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedReviewDays",
          label: "Supplied Review Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "recordAgeDays",
          label: "Record Age Days",
          valueType: { type: "integer" },
        },
        {
          id: "reviewAgeDays",
          label: "Review Age Days",
          valueType: { type: "integer" },
        },
        {
          id: "reviewMarginDays",
          label: "Review Margin Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = protectiveRecordReviewGapTool.execute;
export default protectiveRecordReviewGapTool;
