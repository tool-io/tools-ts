import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly realNome: number;
  readonly productFactors: number;
}>;
export type Output = Readonly<{ readonly finiteDedekindEtaRealNome: number }>;
const inputFields = [
  { id: "realNome", label: "Real nome", kind: "number" },
  { id: "productFactors", label: "Product factors", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.realNome <= 0 || input.realNome >= 1)
    simpleError("nome", "Real q=exp(2πiτ) in (0,1) required.");
  const n = bounded(input.productFactors, "factors", 1, 100000);
  let log = Math.log(input.realNome) / 24,
    p = input.realNome;
  for (let j = 1; j <= n; j++) {
    log += Math.log1p(-p);
    p *= input.realNome;
  }
  return { finiteDedekindEtaRealNome: Math.exp(log) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  realNome: 0.1,
  productFactors: 3,
} satisfies Input;
export const exampleOutput = {
  finiteDedekindEtaRealNome: 0.8086796707457473,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/dedekind-eta-approx",
  title: "Dedekind Eta Approximation",
  description:
    "Approximate real positive-nome Dedekind eta q^(1/24)∏_(n=1..N)(1−q^n), τ purely imaginary and q=exp(2πiτ); explicit finite product, not generic complex eta or a duplicate alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteDedekindEtaRealNome",
      label: "Finite dedekind eta real nome",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      realNome: value.realNome as number,
      productFactors: value.productFactors as number,
    }),
});
export const run = tool.execute;
export default tool;
