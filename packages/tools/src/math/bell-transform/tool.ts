import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, integer, choose } from "../batch-shared.js";
export type Input = Readonly<{
  readonly exponentialSeriesCoefficientsFromIndexOne: readonly number[];
}>;
export type Output = Readonly<{
  readonly completeBellTransform: readonly string[];
}>;
const inputFields = [
  {
    id: "exponentialSeriesCoefficientsFromIndexOne",
    label: "Exponential series coefficients from index one",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const a = input.exponentialSeriesCoefficientsFromIndexOne;
  if (!a.length || a.length > 64)
    simpleError(
      "sequence",
      "1–64 integer exponential-series coefficients a1..aN required.",
    );
  a.forEach((v) => integer(v, "sequence"));
  const out: bigint[] = [1n];
  for (let n = 1; n <= a.length; n++) {
    let s = 0n;
    for (let k = 1; k <= n; k++)
      s += choose(n - 1, k - 1) * BigInt(a[k - 1]) * out[n - k];
    out.push(s);
  }
  return { completeBellTransform: out.map(String) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  exponentialSeriesCoefficientsFromIndexOne: [1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  completeBellTransform: ["1", "1", "2", "5", "15"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/bell-transform",
  title: "Bell Transform Calculator",
  description:
    "Compute complete exponential Bell-polynomial transform with b0=1 and b_n=Σ C(n−1,k−1)a_k b_(n−k); caller sequence differs materially from a single Bell number.",
  inputs: inputFields,
  outputs: [
    {
      id: "completeBellTransform",
      label: "Complete bell transform",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      exponentialSeriesCoefficientsFromIndexOne:
        value.exponentialSeriesCoefficientsFromIndexOne as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
