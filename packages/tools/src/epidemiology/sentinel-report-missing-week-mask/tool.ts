import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedWeeks: readonly number[];
  readonly expectedWeeks: readonly number[];
};
export type Output = {
  readonly missingWeeks: readonly number[];
  readonly unexpectedWeeks: readonly number[];
  readonly complete: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedWeeks: { type: "array", maxItems: 256, items: { type: "integer" } },
    expectedWeeks: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["reportedWeeks", "expectedWeeks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingWeeks: { type: "array", maxItems: 256, items: { type: "integer" } },
    unexpectedWeeks: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    complete: { type: "boolean" },
  },
  required: ["missingWeeks", "unexpectedWeeks", "complete"],
} as const;
/** Exact caller-defined week identifier audit; reporting completeness does not imply zero cases or surveillance sensitivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedWeeks, expectedWeeks } = request;
  const compute = (): Output => {
    H.domain(
      new Set(reportedWeeks).size === reportedWeeks.length &&
        new Set(expectedWeeks).size === expectedWeeks.length,
    );
    const reports = new Set(reportedWeeks),
      expected = new Set(expectedWeeks),
      missingWeeks = expectedWeeks.filter((x) => !reports.has(x));
    return {
      missingWeeks,
      unexpectedWeeks: reportedWeeks.filter((x) => !expected.has(x)),
      complete: missingWeeks.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedWeeks: [1, 3, 5], expectedWeeks: [1, 2, 3] },
  output: { missingWeeks: [2], unexpectedWeeks: [5], complete: false },
} satisfies ToolExample<Input, Output>;
export const sentinelReportMissingWeekMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/sentinel-report-missing-week-mask",
    title: "Sentinel Report Missing Week Mask Tool",
    description:
      "Exact caller-defined week identifier audit; reporting completeness does not imply zero cases or surveillance sensitivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedWeeks: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        expectedWeeks: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["reportedWeeks", "expectedWeeks"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingWeeks: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        unexpectedWeeks: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        complete: { type: "boolean" },
      },
      required: ["missingWeeks", "unexpectedWeeks", "complete"],
    },
    ports: {
      inputs: [
        {
          id: "reportedWeeks",
          label: "Reported Weeks",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "expectedWeeks",
          label: "Expected Weeks",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "missingWeeks",
          label: "Missing Weeks",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "unexpectedWeeks",
          label: "Unexpected Weeks",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "complete", label: "Complete", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = sentinelReportMissingWeekMaskTool.execute;
export default sentinelReportMissingWeekMaskTool;
