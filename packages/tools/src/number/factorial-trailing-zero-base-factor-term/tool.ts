import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  factorialN: number;
  prime: number;
  basePrimeMultiplicity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "factorialN", label: "Factorial n", kind: "integer" },
  { id: "prime", label: "Prime", kind: "integer" },
  {
    id: "basePrimeMultiplicity",
    label: "Base prime multiplicity",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.factorialN, 0, 1000000000);
  H.int(i.prime, 2, 1000000);
  H.int(i.basePrimeMultiplicity, 1, 128);
  for (let d = 2; d * d <= i.prime; d++) H.check(i.prime % d !== 0);
  let q = i.factorialN,
    valuation = 0;
  while (q >= i.prime) {
    q = Math.floor(q / i.prime);
    valuation += q;
  }
  return H.finish({
    primeValuation: valuation,
    trailingZeroContribution: Math.floor(valuation / i.basePrimeMultiplicity),
  });
};
export const example = {
  input: { factorialN: 10, prime: 5, basePrimeMultiplicity: 1 },
  output: { result: { primeValuation: 2, trailingZeroContribution: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/factorial-trailing-zero-base-factor-term",
  title: "Number: Factorial Trailing Zero Base Factor Term Tool",
  description:
    "Compute one Legendre prime valuation contribution to n! trailing zeros for an explicitly supplied prime factor and base multiplicity; does not factor a base.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          primeValuation: { type: "number" },
          trailingZeroContribution: { type: "number" },
        },
        required: ["primeValuation", "trailingZeroContribution"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
