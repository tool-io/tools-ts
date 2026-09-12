import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, choose } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualConvolutionIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualConvolutionIndex",
    label: "Actual convolution index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualConvolutionIndex, "n", 0, 500);
  let s = 0n;
  for (let k = 0; k <= input.actualConvolutionIndex; k++)
    s +=
      (choose(2 * k, k) / BigInt(k + 1)) *
      (choose(
        2 * (input.actualConvolutionIndex - k),
        input.actualConvolutionIndex - k,
      ) /
        BigInt(input.actualConvolutionIndex - k + 1));
  return { exactCatalanConvolution: s.toString() };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualConvolutionIndex: 2 },
  output: { result: { exactCatalanConvolution: "5" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/catalan-convolution",
  title: "Catalan Convolution Calculator",
  description:
    "ExactCatalanconvolution\u03a3CkC(n\u2212k)=C(n+1), not Catalan single-number alias. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
