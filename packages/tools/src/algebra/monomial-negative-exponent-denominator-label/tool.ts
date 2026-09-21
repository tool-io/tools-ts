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
  readonly exponents: readonly number[];
  readonly names: readonly string[];
};
export type Output = {
  readonly numerator: string;
  readonly denominator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exponents: { type: "array", maxItems: 256, items: { type: "integer" } },
    names: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["exponents", "names"],
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
/** Compute monomial negative exponent denominator label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { exponents, names } = input;
  const compute = (): Output => {
    sameLength(exponents, names);
    domain(new Set(names).size === names.length);
    domain(names.every((x) => /^[A-Za-z][A-Za-z0-9_]*(?![\s\S])/.test(x)));
    return {
      numerator:
        names
          .filter((_, i) => exponents[i] > 0)
          .map((x) => x + "^" + exponents[names.indexOf(x)])
          .join("*") || "1",
      denominator:
        names
          .filter((_, i) => exponents[i] < 0)
          .map((x) => x + "^" + Math.abs(exponents[names.indexOf(x)]))
          .join("*") || "1",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { exponents: [2, -3], names: ["x", "y"] },
  output: { numerator: "x^2", denominator: "y^3" },
} satisfies ToolExample<Input, Output>;
export const monomialNegativeExponentDenominatorLabelTool =
  defineSchemaCalculation<Input, Output>({
    id: "algebra/monomial-negative-exponent-denominator-label",
    title: "Monomial Negative Exponent Denominator Label Tool",
    description:
      "Compute monomial negative exponent denominator label from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "exponents",
          label: "Exponents",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "names",
          label: "Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
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
export const run = monomialNegativeExponentDenominatorLabelTool.execute;
export default monomialNegativeExponentDenominatorLabelTool;
