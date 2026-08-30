import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  choose,
  factorial,
} from "../batch-shared.js";
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
    let s = 0n;
    for (let k = 1; k <= n; k++)
      s += ((choose(n - 1, k - 1) * factorial(n)) / factorial(k)) * a[k];
    out.push(s);
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
  exactTransformedSequence: ["0", "1", "3", "13", "73"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/lah-transform",
  title: "Lah Transform Calculator",
  description:
    "Compute exact unsigned Lah transform b_n=Σ T(n,k)a_k, preserving integer output as strings and index-zero convention; bounded to n≤64, not a named-number lookup.",
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
