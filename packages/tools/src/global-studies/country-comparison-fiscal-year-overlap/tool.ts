import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = {
  readonly overlap: number;
  readonly firstCoverage: number;
  readonly secondCoverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "number" },
    firstEnd: { type: "number" },
    secondStart: { type: "number" },
    secondEnd: { type: "number" },
  },
  required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "number" },
    firstCoverage: { type: "number" },
    secondCoverage: { type: "number" },
  },
  required: ["overlap", "firstCoverage", "secondCoverage"],
} as const;
/** Shared half-open time-axis overlap for two fiscal reporting intervals; no country fiscal calendar is embedded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.domain(firstEnd > firstStart && secondEnd > secondStart);
    return {
      overlap: Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
      ),
      firstCoverage:
        Math.max(
          0,
          Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
        ) /
        (firstEnd - firstStart),
      secondCoverage:
        Math.max(
          0,
          Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
        ) /
        (secondEnd - secondStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 0, firstEnd: 12, secondStart: 3, secondEnd: 15 },
  output: { overlap: 9, firstCoverage: 0.75, secondCoverage: 0.75 },
} satisfies ToolExample<Input, Output>;
export const countryComparisonFiscalYearOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/country-comparison-fiscal-year-overlap",
    title: "Country Comparison Fiscal Year Overlap Tool",
    description:
      "Shared half-open time-axis overlap for two fiscal reporting intervals; no country fiscal calendar is embedded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "number" },
        firstEnd: { type: "number" },
        secondStart: { type: "number" },
        secondEnd: { type: "number" },
      },
      required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        firstCoverage: { type: "number" },
        secondCoverage: { type: "number" },
      },
      required: ["overlap", "firstCoverage", "secondCoverage"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEnd",
          label: "Second End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        {
          id: "firstCoverage",
          label: "First Coverage",
          valueType: { type: "number" },
        },
        {
          id: "secondCoverage",
          label: "Second Coverage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = countryComparisonFiscalYearOverlapTool.execute;
export default countryComparisonFiscalYearOverlapTool;
