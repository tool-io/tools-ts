import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualSequenceAtOneBasedIntegers: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSequenceAtOneBasedIntegers",
    label: "Actual sequence at one based integers",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualSequenceAtOneBasedIntegers.length)
    simpleError("sequence", "Actualsequence1…N.");
  const a = [...input.actualSequenceAtOneBasedIntegers];
  for (let n = 1; n <= a.length; n++)
    for (let k = 2 * n; k <= a.length; k += n) a[k - 1] -= a[n - 1];
  return { divisorMobiusTransform: a };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSequenceAtOneBasedIntegers: [1, 2, 3, 4] },
  output: { result: { divisorMobiusTransform: [1, 1, 2, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/mobius-transform",
  title: "M\u00f6bius Transform Calculator",
  description:
    "NumbertheoreticdivisorMobiusinversiong(n)=\u03a3d|n\u03bc(d) f(n/d), not complex fractional-linearMobiusmap. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
