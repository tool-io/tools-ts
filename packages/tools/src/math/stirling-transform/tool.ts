import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, integer } from "../batch-shared.js";
export type Input = Readonly<{
  readonly integerSequenceFromIndexZero: readonly number[];
}>;
export type Output = Readonly<{
  readonly exactTransformedSequence: readonly string[];
}>;
const inputFields = [
  {
    id: "integerSequenceFromIndexZero",
    label: "Integer sequence from index zero",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const inputValues = input.integerSequenceFromIndexZero;
  if (!inputValues.length || inputValues.length > 65)
    simpleError("sequence", "At most 65 coefficients starting a0 required.");
  inputValues.forEach((v) => integer(v, "sequence"));
  const a = inputValues.map(BigInt),
    out: bigint[] = [];
  let row: bigint[] = [1n];
  for (let n = 0; n < a.length; n++) {
    if (n === 0) {
      out.push(a[0]);
      continue;
    }
    const next = Array<bigint>(n + 1).fill(0n);
    for (let k = 1; k <= n; k++)
      next[k] = (row[k - 1] ?? 0n) + BigInt(k) * (row[k] ?? 0n);
    row = next;
    out.push(row.reduce((s, v, k) => s + v * a[k], 0n));
  }
  return { exactTransformedSequence: out.map(String) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  integerSequenceFromIndexZero: [0, 1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  exactTransformedSequence: ["0", "1", "2", "5", "15"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/stirling-transform",
  title: "Stirling Transform Calculator",
  description:
    "Compute exact second-kind Stirling transform b_n=Σ T(n,k)a_k, preserving integer output as strings and index-zero convention; bounded to n≤64, not a named-number lookup.",
  inputs: inputFields,
  outputs: [
    {
      id: "exactTransformedSequence",
      label: "Exact transformed sequence",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      integerSequenceFromIndexZero:
        value.integerSequenceFromIndexZero as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
