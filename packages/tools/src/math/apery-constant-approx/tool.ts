import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{ readonly seriesTerms: number }>;
export type Output = Readonly<{ readonly finiteAperyAcceleratedSum: number }>;
const inputFields = [
  { id: "seriesTerms", label: "Series terms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.seriesTerms, "seriesTerms", 1, 1000);
  let c = 2,
    sum = 0;
  for (let k = 1; k <= n; k++) {
    sum += (k % 2 ? 1 : -1) / (k ** 3 * c);
    c *= (2 * (2 * k + 1)) / (k + 1);
  }
  return { finiteAperyAcceleratedSum: 2.5 * sum };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { seriesTerms: 3 } satisfies Input;
export const exampleOutput = {
  finiteAperyAcceleratedSum: 1.2025462962962963,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/apery-constant-approx",
  title: "Apéry Constant Approximation",
  description:
    "Approximate ζ(3) by convergent accelerated Apéry identity (5/2)Σ(-1)^(k−1)/(k³ C(2k,k)); supplied term count controls truncation, large denominators naturally underflow omitted terms to zero.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteAperyAcceleratedSum",
      label: "Finite apery accelerated sum",
      kind: "number",
    },
  ],
  calculate: (value) => calculate({ seriesTerms: value.seriesTerms as number }),
});
export const run = tool.execute;
export default tool;
