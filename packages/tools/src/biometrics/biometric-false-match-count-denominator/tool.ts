import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly falseMatches: number;
  readonly nonmatchComparisons: number;
  readonly excluded: number;
  readonly includeExcluded: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly falseMatchRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    falseMatches: { type: "integer", minimum: 0 },
    nonmatchComparisons: { type: "integer", minimum: 1 },
    excluded: { type: "integer", minimum: 0 },
    includeExcluded: { type: "boolean" },
  },
  required: [
    "falseMatches",
    "nonmatchComparisons",
    "excluded",
    "includeExcluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    falseMatchRate: { type: "number" },
  },
  required: ["denominator", "falseMatchRate"],
} as const;
/** Compute observed false-match rate using an explicit nonmated-comparison denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { falseMatches, nonmatchComparisons, excluded, includeExcluded } =
    request;
  const compute = (): Output => {
    H.integer(nonmatchComparisons, 1);
    H.integer(falseMatches, 0, nonmatchComparisons);
    H.integer(excluded, 0);
    return {
      denominator: nonmatchComparisons + (includeExcluded ? excluded : 0),
      falseMatchRate:
        falseMatches / (nonmatchComparisons + (includeExcluded ? excluded : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    falseMatches: 2,
    nonmatchComparisons: 1000,
    excluded: 100,
    includeExcluded: false,
  },
  output: { denominator: 1000, falseMatchRate: 0.002 },
} satisfies ToolExample<Input, Output>;
export const biometricFalseMatchCountDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biometrics/biometric-false-match-count-denominator",
      title: "Biometric False Match Count Denominator Tool",
      description:
        "Compute observed false-match rate using an explicit nonmated-comparison denominator.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          falseMatches: { type: "integer", minimum: 0 },
          nonmatchComparisons: { type: "integer", minimum: 1 },
          excluded: { type: "integer", minimum: 0 },
          includeExcluded: { type: "boolean" },
        },
        required: [
          "falseMatches",
          "nonmatchComparisons",
          "excluded",
          "includeExcluded",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          falseMatchRate: { type: "number" },
        },
        required: ["denominator", "falseMatchRate"],
      },
      ports: {
        inputs: [
          {
            id: "falseMatches",
            label: "False Matches",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "nonmatchComparisons",
            label: "Nonmatch Comparisons",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeExcluded",
            label: "Include Excluded",
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
            id: "falseMatchRate",
            label: "False Match Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biometricFalseMatchCountDenominatorTool.execute;
export default biometricFalseMatchCountDenominatorTool;
