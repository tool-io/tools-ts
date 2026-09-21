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
  readonly power: number;
};
export type Output = { readonly exponents: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exponents: { type: "array", maxItems: 256, items: { type: "integer" } },
    power: { type: "integer", minimum: 0, maximum: 1000000 },
  },
  required: ["exponents", "power"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exponents: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["exponents"],
} as const;
/** Compute monomial power composition exponent term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { exponents, power } = input;
  const compute = (): Output => {
    integer(power, 0, 1000000);
    domain(exponents.every((x) => x >= 0));
    return { exponents: exponents.map((x) => x * power) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { exponents: [2, 3], power: 4 },
  output: { exponents: [8, 12] },
} satisfies ToolExample<Input, Output>;
export const monomialPowerCompositionExponentTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "algebra/monomial-power-composition-exponent-term",
  title: "Monomial Power Composition Exponent Term Tool",
  description:
    "Compute monomial power composition exponent term from explicit bounded inputs.",
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
        id: "power",
        label: "Power",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "exponents",
        label: "Exponents",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = monomialPowerCompositionExponentTermTool.execute;
export default monomialPowerCompositionExponentTermTool;
