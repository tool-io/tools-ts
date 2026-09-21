import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly exponents: readonly number[];
  readonly degree: number;
};
export type Output = {
  readonly exact: boolean;
  readonly rootExponents: readonly number[];
  readonly remainders: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exponents: { type: "array", maxItems: 256, items: { type: "integer" } },
    degree: { type: "integer", minimum: 1, maximum: 1000000 },
  },
  required: ["exponents", "degree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exact: { type: "boolean" },
    rootExponents: { type: "array", maxItems: 256, items: { type: "integer" } },
    remainders: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["exact", "rootExponents", "remainders"],
} as const;
/** Compute monomial radical exponent divisibility from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { exponents, degree } = input;
  const compute = (): Output => {
    integer(degree, 1, 1000000);
    domain(exponents.every((x) => x >= 0));
    const remainders = exponents.map((x) => x % degree);
    return {
      exact: remainders.every((x) => x === 0),
      rootExponents: exponents.map((x) => Math.floor(x / degree)),
      remainders,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { exponents: [4, 6], degree: 2 },
  output: { exact: true, rootExponents: [2, 3], remainders: [0, 0] },
} satisfies ToolExample<Input, Output>;
export const monomialRadicalExponentDivisibilityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "algebra/monomial-radical-exponent-divisibility",
  title: "Monomial Radical Exponent Divisibility Tool",
  description:
    "Compute monomial radical exponent divisibility from explicit bounded inputs.",
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
        id: "degree",
        label: "Degree",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "exact", label: "Exact", valueType: { type: "boolean" } },
      {
        id: "rootExponents",
        label: "Root Exponents",
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "remainders",
        label: "Remainders",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = monomialRadicalExponentDivisibilityTool.execute;
export default monomialRadicalExponentDivisibilityTool;
