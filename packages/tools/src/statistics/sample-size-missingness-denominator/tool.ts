import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalCount: number;
  readonly missingCount: number;
};
export type Output = {
  readonly observedCount: number;
  readonly missingFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCount: { type: "integer", minimum: 1 },
    missingCount: { type: "integer", minimum: 0 },
  },
  required: ["totalCount", "missingCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedCount: { type: "integer" },
    missingFraction: { type: "number" },
  },
  required: ["observedCount", "missingFraction"],
} as const;
/** Resolve the observed sample count and missing fraction from explicit total and missing counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalCount, missingCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalCount) &&
        totalCount >= 1 &&
        totalCount <= Number.MAX_SAFE_INTEGER,
      "totalCount",
    ),
      totalCount);
    (H.domain(
      Number.isSafeInteger(missingCount) &&
        missingCount >= 0 &&
        missingCount <= totalCount,
      "missingCount",
    ),
      missingCount);
    return {
      observedCount: totalCount - missingCount,
      missingFraction: missingCount / totalCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalCount: 20, missingCount: 3 },
  output: { observedCount: 17, missingFraction: 0.15 },
} satisfies ToolExample<Input, Output>;
export const sampleSizeMissingnessDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/sample-size-missingness-denominator",
    title: "Sample Size Missingness Denominator Tool",
    description:
      "Resolve the observed sample count and missing fraction from explicit total and missing counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCount: { type: "integer", minimum: 1 },
        missingCount: { type: "integer", minimum: 0 },
      },
      required: ["totalCount", "missingCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedCount: { type: "integer" },
        missingFraction: { type: "number" },
      },
      required: ["observedCount", "missingFraction"],
    },
    ports: {
      inputs: [
        {
          id: "totalCount",
          label: "Total Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "missingCount",
          label: "Missing Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "observedCount",
          label: "Observed Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingFraction",
          label: "Missing Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleSizeMissingnessDenominatorTool.execute;
export default sampleSizeMissingnessDenominatorTool;
