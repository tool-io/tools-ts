import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly falseNonmatches: number;
  readonly genuineComparisons: number;
  readonly failuresToAcquire: number;
  readonly includeFailures: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly failureRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    falseNonmatches: { type: "integer", minimum: 0 },
    genuineComparisons: { type: "integer", minimum: 1 },
    failuresToAcquire: { type: "integer", minimum: 0 },
    includeFailures: { type: "boolean" },
  },
  required: [
    "falseNonmatches",
    "genuineComparisons",
    "failuresToAcquire",
    "includeFailures",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    failureRate: { type: "number" },
  },
  required: ["denominator", "failureRate"],
} as const;
/** Keep matcher nonmatch and acquisition-failure denominator policies explicit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    falseNonmatches,
    genuineComparisons,
    failuresToAcquire,
    includeFailures,
  } = request;
  const compute = (): Output => {
    H.integer(genuineComparisons, 1);
    H.integer(falseNonmatches, 0, genuineComparisons);
    H.integer(failuresToAcquire, 0);
    return {
      denominator:
        genuineComparisons + (includeFailures ? failuresToAcquire : 0),
      failureRate:
        (falseNonmatches + (includeFailures ? failuresToAcquire : 0)) /
        (genuineComparisons + (includeFailures ? failuresToAcquire : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    falseNonmatches: 5,
    genuineComparisons: 100,
    failuresToAcquire: 10,
    includeFailures: false,
  },
  output: { denominator: 100, failureRate: 0.05 },
} satisfies ToolExample<Input, Output>;
export const biometricFalseNonmatchCountDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biometrics/biometric-false-nonmatch-count-denominator",
      title: "Biometric False Nonmatch Count Denominator Tool",
      description:
        "Keep matcher nonmatch and acquisition-failure denominator policies explicit.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          falseNonmatches: { type: "integer", minimum: 0 },
          genuineComparisons: { type: "integer", minimum: 1 },
          failuresToAcquire: { type: "integer", minimum: 0 },
          includeFailures: { type: "boolean" },
        },
        required: [
          "falseNonmatches",
          "genuineComparisons",
          "failuresToAcquire",
          "includeFailures",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          failureRate: { type: "number" },
        },
        required: ["denominator", "failureRate"],
      },
      ports: {
        inputs: [
          {
            id: "falseNonmatches",
            label: "False Nonmatches",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "genuineComparisons",
            label: "Genuine Comparisons",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "failuresToAcquire",
            label: "Failures To Acquire",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeFailures",
            label: "Include Failures",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "failureRate",
            label: "Failure Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biometricFalseNonmatchCountDenominatorTool.execute;
export default biometricFalseNonmatchCountDenominatorTool;
