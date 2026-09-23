import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly periodStart: number;
  readonly periodEnd: number;
  readonly reviewStart: number;
  readonly reviewEnd: number;
  readonly totalCost: number;
};
export type Output = {
  readonly overlapDays: number;
  readonly share: number;
  readonly allocatedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodStart: { type: "integer" },
    periodEnd: { type: "integer" },
    reviewStart: { type: "integer" },
    reviewEnd: { type: "integer" },
    totalCost: { type: "number", minimum: 0 },
  },
  required: [
    "periodStart",
    "periodEnd",
    "reviewStart",
    "reviewEnd",
    "totalCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDays: { type: "integer" },
    share: { type: "number" },
    allocatedCost: { type: "number" },
  },
  required: ["overlapDays", "share", "allocatedCost"],
} as const;
/** Calculate biosecurity review date proration term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { periodStart, periodEnd, reviewStart, reviewEnd, totalCost } = request;
  const compute = (): Output => {
    H.domain(
      periodEnd > periodStart && reviewEnd >= reviewStart && totalCost >= 0,
    );
    return {
      overlapDays: Math.max(
        0,
        Math.min(periodEnd, reviewEnd) - Math.max(periodStart, reviewStart),
      ),
      share:
        Math.max(
          0,
          Math.min(periodEnd, reviewEnd) - Math.max(periodStart, reviewStart),
        ) /
        (periodEnd - periodStart),
      allocatedCost:
        (totalCost *
          Math.max(
            0,
            Math.min(periodEnd, reviewEnd) - Math.max(periodStart, reviewStart),
          )) /
        (periodEnd - periodStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    periodStart: 0,
    periodEnd: 30,
    reviewStart: 10,
    reviewEnd: 40,
    totalCost: 300,
  },
  output: { overlapDays: 20, share: 0.6666666666666666, allocatedCost: 200 },
} satisfies ToolExample<Input, Output>;
export const biosecurityReviewDateProrationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/biosecurity-review-date-proration-term",
    title: "Biosecurity Review Date Proration Term Tool",
    description:
      "Calculate biosecurity review date proration term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodStart: { type: "integer" },
        periodEnd: { type: "integer" },
        reviewStart: { type: "integer" },
        reviewEnd: { type: "integer" },
        totalCost: { type: "number", minimum: 0 },
      },
      required: [
        "periodStart",
        "periodEnd",
        "reviewStart",
        "reviewEnd",
        "totalCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDays: { type: "integer" },
        share: { type: "number" },
        allocatedCost: { type: "number" },
      },
      required: ["overlapDays", "share", "allocatedCost"],
    },
    ports: {
      inputs: [
        {
          id: "periodStart",
          label: "Period Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "periodEnd",
          label: "Period End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reviewStart",
          label: "Review Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reviewEnd",
          label: "Review End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalCost",
          label: "Total Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapDays",
          label: "Overlap Days",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "allocatedCost",
          label: "Allocated Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosecurityReviewDateProrationTermTool.execute;
export default biosecurityReviewDateProrationTermTool;
