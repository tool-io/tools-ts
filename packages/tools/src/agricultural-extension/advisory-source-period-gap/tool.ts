import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly adviceDate: string;
  readonly sourceStartDate: string;
  readonly sourceEndDate: string;
  readonly reviewDate: string;
};
export type Output = {
  readonly daysFromSourceStart: number;
  readonly daysToSourceEnd: number;
  readonly ageAtReviewDays: number;
  readonly insideSourcePeriod: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adviceDate: { type: "string", maxLength: 8192 },
    sourceStartDate: { type: "string", maxLength: 8192 },
    sourceEndDate: { type: "string", maxLength: 8192 },
    reviewDate: { type: "string", maxLength: 8192 },
  },
  required: ["adviceDate", "sourceStartDate", "sourceEndDate", "reviewDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    daysFromSourceStart: { type: "integer" },
    daysToSourceEnd: { type: "integer" },
    ageAtReviewDays: { type: "integer" },
    insideSourcePeriod: { type: "boolean" },
  },
  required: [
    "daysFromSourceStart",
    "daysToSourceEnd",
    "ageAtReviewDays",
    "insideSourcePeriod",
  ],
} as const;
/** Calculate advisory source period gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { adviceDate, sourceStartDate, sourceEndDate, reviewDate } = request;
  const compute = (): Output => {
    return (() => {
      const a = H.dateOnly(adviceDate).getTime(),
        b = H.dateOnly(sourceStartDate).getTime(),
        c = H.dateOnly(sourceEndDate).getTime(),
        d = H.dateOnly(reviewDate).getTime();
      H.domain(c >= b && d >= a);
      return {
        daysFromSourceStart: (a - b) / 86400000,
        daysToSourceEnd: (c - a) / 86400000,
        ageAtReviewDays: (d - a) / 86400000,
        insideSourcePeriod: a >= b && a < c,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    adviceDate: "2024-01-05",
    sourceStartDate: "2024-01-01",
    sourceEndDate: "2024-01-10",
    reviewDate: "2024-01-08",
  },
  output: {
    daysFromSourceStart: 4,
    daysToSourceEnd: 5,
    ageAtReviewDays: 3,
    insideSourcePeriod: true,
  },
} satisfies ToolExample<Input, Output>;
export const advisorySourcePeriodGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/advisory-source-period-gap",
    title: "Advisory Source Period Gap Tool",
    description:
      "Calculate advisory source period gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adviceDate: { type: "string", maxLength: 8192 },
        sourceStartDate: { type: "string", maxLength: 8192 },
        sourceEndDate: { type: "string", maxLength: 8192 },
        reviewDate: { type: "string", maxLength: 8192 },
      },
      required: [
        "adviceDate",
        "sourceStartDate",
        "sourceEndDate",
        "reviewDate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        daysFromSourceStart: { type: "integer" },
        daysToSourceEnd: { type: "integer" },
        ageAtReviewDays: { type: "integer" },
        insideSourcePeriod: { type: "boolean" },
      },
      required: [
        "daysFromSourceStart",
        "daysToSourceEnd",
        "ageAtReviewDays",
        "insideSourcePeriod",
      ],
    },
    ports: {
      inputs: [
        {
          id: "adviceDate",
          label: "Advice Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceStartDate",
          label: "Source Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceEndDate",
          label: "Source End Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reviewDate",
          label: "Review Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "daysFromSourceStart",
          label: "Days From Source Start",
          valueType: { type: "integer" },
        },
        {
          id: "daysToSourceEnd",
          label: "Days To Source End",
          valueType: { type: "integer" },
        },
        {
          id: "ageAtReviewDays",
          label: "Age At Review Days",
          valueType: { type: "integer" },
        },
        {
          id: "insideSourcePeriod",
          label: "Inside Source Period",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = advisorySourcePeriodGapTool.execute;
export default advisorySourcePeriodGapTool;
