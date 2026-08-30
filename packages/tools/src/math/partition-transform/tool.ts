import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, integer } from "../batch-shared.js";
export type Input = Readonly<{
  readonly integerEulerProductExponents: readonly number[];
}>;
export type Output = Readonly<{
  readonly partitionProductCoefficients: readonly string[];
}>;
const inputFields = [
  {
    id: "integerEulerProductExponents",
    label: "Integer euler product exponents",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const a = input.integerEulerProductExponents;
  if (!a.length || a.length > 64)
    simpleError("exponents", "1–64 signed integer exponents a1..aN required.");
  a.forEach((v) => integer(v, "exponents"));
  const out: bigint[] = [1n],
    c: bigint[] = [0n];
  for (let k = 1; k <= a.length; k++) {
    let s = 0n;
    for (let d = 1; d <= k; d++)
      if (k % d === 0) s += BigInt(d) * BigInt(a[d - 1]);
    c.push(s);
    let total = 0n;
    for (let j = 1; j <= k; j++) total += c[j] * out[k - j];
    if (total % BigInt(k))
      simpleError("exponents", "Exact Euler transform divisibility failure.");
    out.push(total / BigInt(k));
  }
  return { partitionProductCoefficients: out.map(String) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  integerEulerProductExponents: [1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  partitionProductCoefficients: ["1", "1", "2", "3", "5"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/partition-transform",
  title: "Partition Transform Calculator",
  description:
    "Compute exact coefficients through N of formal product ∏(1−x^k)^(-a_k), allowing signed caller exponent sequence; not ordinary unrestricted partition count or finite q product evaluation.",
  inputs: inputFields,
  outputs: [
    {
      id: "partitionProductCoefficients",
      label: "Partition product coefficients",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      integerEulerProductExponents:
        value.integerEulerProductExponents as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
