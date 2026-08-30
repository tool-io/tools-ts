import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, jumps } from "../batch-shared.js";
export type Input = Readonly<{ readonly primeCutoff: number }>;
export type Output = Readonly<{
  readonly strictRecordGapSizes: readonly number[];
  readonly recordGapLeftPrimes: readonly number[];
  readonly recordGapRightPrimes: readonly number[];
}>;
const inputFields = [
  { id: "primeCutoff", label: "Prime cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const { ps, gaps } = jumps(input.primeCutoff),
    sizes: number[] = [],
    left: number[] = [],
    right: number[] = [];
  let record = 0;
  gaps.forEach((v, i) => {
    if (v > record) {
      record = v;
      sizes.push(v);
      left.push(ps[i]);
      right.push(ps[i + 1]);
    }
  });
  return {
    strictRecordGapSizes: sizes,
    recordGapLeftPrimes: left,
    recordGapRightPrimes: right,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { primeCutoff: 13 } satisfies Input;
export const exampleOutput = {
  strictRecordGapSizes: [1, 2, 4],
  recordGapLeftPrimes: [2, 3, 7],
  recordGapRightPrimes: [3, 5, 11],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/prime-gap-record",
  title: "Prime Gap Record Calculator",
  description:
    "Find strict successive prime-gap records with both endpoints ≤caller sieve cutoff; equal ties are not new records and no outside-cutoff maximality claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "strictRecordGapSizes",
      label: "Strict record gap sizes",
      kind: "numberList",
    },
    {
      id: "recordGapLeftPrimes",
      label: "Record gap left primes",
      kind: "numberList",
    },
    {
      id: "recordGapRightPrimes",
      label: "Record gap right primes",
      kind: "numberList",
    },
  ],
  calculate: (value) => calculate({ primeCutoff: value.primeCutoff as number }),
});
export const run = tool.execute;
export default tool;
