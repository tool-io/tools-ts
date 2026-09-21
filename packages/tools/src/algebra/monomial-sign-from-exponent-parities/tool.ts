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
  readonly bases: readonly number[];
  readonly exponents: readonly number[];
};
export type Output = { readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bases: { type: "array", maxItems: 256, items: { type: "number" } },
    exponents: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["bases", "exponents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sign: { type: "integer" } },
  required: ["sign"],
} as const;
/** Compute monomial sign from exponent parities from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { bases, exponents } = input;
  const compute = (): Output => {
    sameLength(bases, exponents);
    domain(exponents.every((x) => x >= 0));
    let sign = 1;
    for (let i = 0; i < bases.length; i++)
      if (exponents[i] > 0) {
        if (bases[i] === 0) sign = 0;
        else if (bases[i] < 0 && exponents[i] % 2) sign = -sign;
      }
    return { sign: sign === 0 ? 0 : sign };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { bases: [-2, 3], exponents: [3, 2] },
  output: { sign: -1 },
} satisfies ToolExample<Input, Output>;
export const monomialSignFromExponentParitiesTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "algebra/monomial-sign-from-exponent-parities",
  title: "Monomial Sign From Exponent Parities Tool",
  description:
    "Compute monomial sign from exponent parities from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "bases",
        label: "Bases",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "exponents",
        label: "Exponents",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
    outputs: [{ id: "sign", label: "Sign", valueType: { type: "integer" } }],
  },
});
export const run = monomialSignFromExponentParitiesTool.execute;
export default monomialSignFromExponentParitiesTool;
