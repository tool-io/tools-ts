import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyPopulation: number;
  readonly referenceRate: number;
  readonly observedCount: number;
};
export type Output = {
  readonly expectedCount: number;
  readonly observedExpectedRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyPopulation: { type: "number", exclusiveMinimum: 0 },
    referenceRate: { type: "number", exclusiveMinimum: 0 },
    observedCount: { type: "integer", minimum: 0 },
  },
  required: ["studyPopulation", "referenceRate", "observedCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedCount: { type: "number" },
    observedExpectedRatio: { type: "number" },
  },
  required: ["expectedCount", "observedExpectedRatio"],
} as const;
/** One expected-count stratum and its observed/expected ratio; aggregate SMR requires sums across all strata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyPopulation, referenceRate, observedCount } = request;
  const compute = (): Output => {
    H.positive(studyPopulation);
    H.positive(referenceRate);
    H.integer(observedCount, 0);
    return {
      expectedCount: studyPopulation * referenceRate,
      observedExpectedRatio: observedCount / (studyPopulation * referenceRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyPopulation: 1000, referenceRate: 0.02, observedCount: 30 },
  output: { expectedCount: 20, observedExpectedRatio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const indirectStandardizationOneExpectedCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/indirect-standardization-one-expected-count",
      title: "Indirect Standardization One Expected Count Tool",
      description:
        "One expected-count stratum and its observed/expected ratio; aggregate SMR requires sums across all strata.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          studyPopulation: { type: "number", exclusiveMinimum: 0 },
          referenceRate: { type: "number", exclusiveMinimum: 0 },
          observedCount: { type: "integer", minimum: 0 },
        },
        required: ["studyPopulation", "referenceRate", "observedCount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedCount: { type: "number" },
          observedExpectedRatio: { type: "number" },
        },
        required: ["expectedCount", "observedExpectedRatio"],
      },
      ports: {
        inputs: [
          {
            id: "studyPopulation",
            label: "Study Population",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceRate",
            label: "Reference Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedCount",
            label: "Observed Count",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "expectedCount",
            label: "Expected Count",
            valueType: { type: "number" },
          },
          {
            id: "observedExpectedRatio",
            label: "Observed Expected Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = indirectStandardizationOneExpectedCountTool.execute;
export default indirectStandardizationOneExpectedCountTool;
