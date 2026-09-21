import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly numerator: readonly number[];
  readonly denominator: readonly number[];
};
export type Output = {
  readonly cancelled: readonly number[];
  readonly numerator: readonly number[];
  readonly denominator: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "array", maxItems: 256, items: { type: "integer" } },
    denominator: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["numerator", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cancelled: { type: "array", maxItems: 256, items: { type: "integer" } },
    numerator: { type: "array", maxItems: 256, items: { type: "integer" } },
    denominator: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["cancelled", "numerator", "denominator"],
} as const;
/** Compute algebraic fraction cancellation exponent term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { numerator, denominator } = input;
  const compute = (): Output => {
    sameLength(numerator, denominator);
    domain(numerator.every((x) => x >= 0) && denominator.every((x) => x >= 0));
    const cancelled = numerator.map((x, i) => Math.min(x, denominator[i]));
    return {
      cancelled,
      numerator: numerator.map((x, i) => x - cancelled[i]),
      denominator: denominator.map((x, i) => x - cancelled[i]),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { numerator: [3, 1], denominator: [1, 4] },
  output: { cancelled: [1, 1], numerator: [2, 0], denominator: [0, 3] },
} satisfies ToolExample<Input, Output>;
export const algebraicFractionCancellationExponentTermTool =
  defineSchemaCalculation<Input, Output>({
    id: "algebra/algebraic-fraction-cancellation-exponent-term",
    title: "Algebraic Fraction Cancellation Exponent Term Tool",
    description:
      "Compute algebraic fraction cancellation exponent term from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "numerator",
          label: "Numerator",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "denominator",
          label: "Denominator",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "cancelled",
          label: "Cancelled",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "numerator",
          label: "Numerator",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  });
export const run = algebraicFractionCancellationExponentTermTool.execute;
export default algebraicFractionCancellationExponentTermTool;
