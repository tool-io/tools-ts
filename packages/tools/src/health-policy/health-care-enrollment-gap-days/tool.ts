import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorCoverageEndExclusive: string;
  readonly nextCoverageStart: string;
};
export type Output = {
  readonly signedGapDays: number;
  readonly uncoveredDays: number;
  readonly overlapDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorCoverageEndExclusive: { type: "string", maxLength: 8192 },
    nextCoverageStart: { type: "string", maxLength: 8192 },
  },
  required: ["priorCoverageEndExclusive", "nextCoverageStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGapDays: { type: "number" },
    uncoveredDays: { type: "number" },
    overlapDays: { type: "number" },
  },
  required: ["signedGapDays", "uncoveredDays", "overlapDays"],
} as const;
/** Compare explicit coverage endpoints under an end-exclusive convention without adjudicating enrollment or entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorCoverageEndExclusive, nextCoverageStart } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    return (() => {
      const signedGapDays =
        (namedDate(nextCoverageStart, "nextCoverageStart").getTime() -
          namedDate(
            priorCoverageEndExclusive,
            "priorCoverageEndExclusive",
          ).getTime()) /
        86400000;
      return {
        signedGapDays,
        uncoveredDays: Math.max(0, signedGapDays),
        overlapDays: Math.max(0, -signedGapDays),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    priorCoverageEndExclusive: "2026-10-01",
    nextCoverageStart: "2026-10-05",
  },
  output: { signedGapDays: 4, uncoveredDays: 4, overlapDays: 0 },
} satisfies ToolExample<Input, Output>;
export const healthCareEnrollmentGapDaysTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["health-policy", "health policy", "social sciences"],
      keywords: ["health policy", "social sciences"],
    },
    id: "health-policy/health-care-enrollment-gap-days",
    title: "Health Care Enrollment Gap Days",
    description:
      "Compare explicit coverage endpoints under an end-exclusive convention without adjudicating enrollment or entitlement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorCoverageEndExclusive: { type: "string", maxLength: 8192 },
        nextCoverageStart: { type: "string", maxLength: 8192 },
      },
      required: ["priorCoverageEndExclusive", "nextCoverageStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGapDays: { type: "number" },
        uncoveredDays: { type: "number" },
        overlapDays: { type: "number" },
      },
      required: ["signedGapDays", "uncoveredDays", "overlapDays"],
    },
    ports: {
      inputs: [
        {
          id: "priorCoverageEndExclusive",
          label: "Prior Coverage End Exclusive",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nextCoverageStart",
          label: "Next Coverage Start",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedGapDays",
          label: "Signed Gap Days",
          valueType: { type: "number" },
        },
        {
          id: "uncoveredDays",
          label: "Uncovered Days",
          valueType: { type: "number" },
        },
        {
          id: "overlapDays",
          label: "Overlap Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthCareEnrollmentGapDaysTool.execute;
export default healthCareEnrollmentGapDaysTool;
