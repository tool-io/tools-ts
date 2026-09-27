import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalTrials: number;
  readonly errors: number;
  readonly excludedCorrect: number;
  readonly includeErrors: boolean;
};
export type Output = {
  readonly eligibleTrials: number;
  readonly errorFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalTrials: { type: "integer", minimum: 1 },
    errors: { type: "integer", minimum: 0 },
    excludedCorrect: { type: "integer", minimum: 0 },
    includeErrors: { type: "boolean" },
  },
  required: ["totalTrials", "errors", "excludedCorrect", "includeErrors"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleTrials: { type: "integer" },
    errorFraction: { type: "number" },
  },
  required: ["eligibleTrials", "errorFraction"],
} as const;
/** Error fraction uses all retained trials; eligibleTrials separately reports the caller policy for latency analysis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalTrials, errors, excludedCorrect, includeErrors } = request;
  const compute = (): Output => {
    H.integer(totalTrials, 1);
    H.integer(errors, 0, totalTrials);
    H.integer(excludedCorrect, 0, totalTrials - errors);
    H.domain(totalTrials - excludedCorrect > 0);
    return {
      eligibleTrials:
        totalTrials - excludedCorrect - (includeErrors ? 0 : errors),
      errorFraction: errors / (totalTrials - excludedCorrect),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalTrials: 100,
    errors: 10,
    excludedCorrect: 10,
    includeErrors: false,
  },
  output: { eligibleTrials: 80, errorFraction: 0.1111111111111111 },
} satisfies ToolExample<Input, Output>;
export const stroopErrorTrialInclusionDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "experimental-psychology/stroop-error-trial-inclusion-denominator",
      title: "Stroop Error Trial Inclusion Denominator Tool",
      description:
        "Error fraction uses all retained trials; eligibleTrials separately reports the caller policy for latency analysis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalTrials: { type: "integer", minimum: 1 },
          errors: { type: "integer", minimum: 0 },
          excludedCorrect: { type: "integer", minimum: 0 },
          includeErrors: { type: "boolean" },
        },
        required: ["totalTrials", "errors", "excludedCorrect", "includeErrors"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleTrials: { type: "integer" },
          errorFraction: { type: "number" },
        },
        required: ["eligibleTrials", "errorFraction"],
      },
      ports: {
        inputs: [
          {
            id: "totalTrials",
            label: "Total Trials",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "errors",
            label: "Errors",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludedCorrect",
            label: "Excluded Correct",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeErrors",
            label: "Include Errors",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "eligibleTrials",
            label: "Eligible Trials",
            valueType: { type: "integer" },
          },
          {
            id: "errorFraction",
            label: "Error Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = stroopErrorTrialInclusionDenominatorTool.execute;
export default stroopErrorTrialInclusionDenominatorTool;
