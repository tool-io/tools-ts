import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly truePositive: number;
  readonly falseNegative: number;
  readonly requiredRecall: number;
};
export type Output = {
  readonly minimumTruePositive: number;
  readonly additionalNeeded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    truePositive: { type: "integer", minimum: 0 },
    falseNegative: { type: "integer", minimum: 0 },
    requiredRecall: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["truePositive", "falseNegative", "requiredRecall"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumTruePositive: { type: "integer" },
    additionalNeeded: { type: "integer" },
  },
  required: ["minimumTruePositive", "additionalNeeded"],
} as const;
/** Compute class recall minimum count margin from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { truePositive, falseNegative, requiredRecall } = input;
  const compute = (): Output => {
    integer(truePositive);
    integer(falseNegative);
    probability(requiredRecall);
    const n = truePositive + falseNegative,
      minimumTruePositive = Math.ceil(n * requiredRecall);
    return {
      minimumTruePositive,
      additionalNeeded: Math.max(0, minimumTruePositive - truePositive),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { truePositive: 6, falseNegative: 4, requiredRecall: 0.8 },
  output: { minimumTruePositive: 8, additionalNeeded: 2 },
} satisfies ToolExample<Input, Output>;
export const classRecallMinimumCountMarginTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/class-recall-minimum-count-margin",
  title: "Class Recall Minimum Count Margin Tool",
  description:
    "Compute class recall minimum count margin from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "truePositive",
        label: "True Positive",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "falseNegative",
        label: "False Negative",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "requiredRecall",
        label: "Required Recall",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "minimumTruePositive",
        label: "Minimum True Positive",
        valueType: { type: "integer" },
      },
      {
        id: "additionalNeeded",
        label: "Additional Needed",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = classRecallMinimumCountMarginTool.execute;
export default classRecallMinimumCountMarginTool;
