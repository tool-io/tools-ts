import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly leftNumerator: string;
  readonly leftDenominator: string;
  readonly rightNumerator: string;
  readonly rightDenominator: string;
  readonly leftWeight: number;
  readonly rightWeight: number;
};
export type Output = {
  readonly numerator: string;
  readonly denominator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftNumerator: { type: "string", maxLength: 8192 },
    leftDenominator: { type: "string", maxLength: 8192 },
    rightNumerator: { type: "string", maxLength: 8192 },
    rightDenominator: { type: "string", maxLength: 8192 },
    leftWeight: { type: "integer", minimum: 0 },
    rightWeight: { type: "integer", minimum: 0 },
  },
  required: [
    "leftNumerator",
    "leftDenominator",
    "rightNumerator",
    "rightDenominator",
    "leftWeight",
    "rightWeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "string", maxLength: 8192 },
    denominator: { type: "string", maxLength: 8192 },
  },
  required: ["numerator", "denominator"],
} as const;
/** Compute rational mediant weighted crosswalk from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const {
    leftNumerator,
    leftDenominator,
    rightNumerator,
    rightDenominator,
    leftWeight,
    rightWeight,
  } = input;
  const compute = (): Output => {
    const a = decimal(leftNumerator),
      b = decimal(leftDenominator),
      c = decimal(rightNumerator),
      d = decimal(rightDenominator);
    domain(b > 0n && d > 0n);
    integer(leftWeight);
    integer(rightWeight);
    domain(leftWeight + rightWeight > 0);
    return {
      numerator: (a * BigInt(leftWeight) + c * BigInt(rightWeight)).toString(),
      denominator: (
        b * BigInt(leftWeight) +
        d * BigInt(rightWeight)
      ).toString(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    leftNumerator: "1",
    leftDenominator: "2",
    rightNumerator: "2",
    rightDenominator: "3",
    leftWeight: 1,
    rightWeight: 1,
  },
  output: { numerator: "3", denominator: "5" },
} satisfies ToolExample<Input, Output>;
export const rationalMediantWeightedCrosswalkTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "number/rational-mediant-weighted-crosswalk",
  title: "Rational Mediant Weighted Crosswalk Tool",
  description:
    "Compute rational mediant weighted crosswalk from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leftNumerator",
        label: "Left Numerator",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "leftDenominator",
        label: "Left Denominator",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "rightNumerator",
        label: "Right Numerator",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "rightDenominator",
        label: "Right Denominator",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "leftWeight",
        label: "Left Weight",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "rightWeight",
        label: "Right Weight",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "numerator", label: "Numerator", valueType: { type: "string" } },
      {
        id: "denominator",
        label: "Denominator",
        valueType: { type: "string" },
      },
    ],
  },
});
export const run = rationalMediantWeightedCrosswalkTool.execute;
export default rationalMediantWeightedCrosswalkTool;
