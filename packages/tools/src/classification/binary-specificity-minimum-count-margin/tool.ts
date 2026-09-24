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
  readonly trueNegative: number;
  readonly falsePositive: number;
  readonly requiredSpecificity: number;
};
export type Output = {
  readonly minimumTrueNegative: number;
  readonly additionalNeeded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trueNegative: { type: "integer", minimum: 0 },
    falsePositive: { type: "integer", minimum: 0 },
    requiredSpecificity: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["trueNegative", "falsePositive", "requiredSpecificity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumTrueNegative: { type: "integer" },
    additionalNeeded: { type: "integer" },
  },
  required: ["minimumTrueNegative", "additionalNeeded"],
} as const;
/** Compute binary specificity minimum count margin from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { trueNegative, falsePositive, requiredSpecificity } = input;
  const compute = (): Output => {
    integer(trueNegative);
    integer(falsePositive);
    probability(requiredSpecificity);
    const minimumTrueNegative = Math.ceil(
      (trueNegative + falsePositive) * requiredSpecificity,
    );
    return {
      minimumTrueNegative,
      additionalNeeded: Math.max(0, minimumTrueNegative - trueNegative),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { trueNegative: 6, falsePositive: 4, requiredSpecificity: 0.8 },
  output: { minimumTrueNegative: 8, additionalNeeded: 2 },
} satisfies ToolExample<Input, Output>;
export const binarySpecificityMinimumCountMarginTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/binary-specificity-minimum-count-margin",
  title: "Binary Specificity Minimum Count Margin Tool",
  description:
    "Compute binary specificity minimum count margin from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "trueNegative",
        label: "True Negative",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "falsePositive",
        label: "False Positive",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "requiredSpecificity",
        label: "Required Specificity",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "minimumTrueNegative",
        label: "Minimum True Negative",
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
export const run = binarySpecificityMinimumCountMarginTool.execute;
export default binarySpecificityMinimumCountMarginTool;
