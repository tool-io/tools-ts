import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{ readonly fibonacciTerms: number }>;
export type Output = Readonly<{
  readonly finiteReciprocalFibonacciSum: number;
}>;
const inputFields = [
  { id: "fibonacciTerms", label: "Fibonacci terms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.fibonacciTerms, "terms", 1, 1000);
  let a = 1,
    b = 1,
    s = 0;
  for (let k = 1; k <= n; k++) {
    s += 1 / a;
    [a, b] = [b, a + b];
  }
  return { finiteReciprocalFibonacciSum: s };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { fibonacciTerms: 5 } satisfies Input;
export const exampleOutput = {
  finiteReciprocalFibonacciSum: 3.0333333333333337,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/reciprocal-fibonacci-constant",
  title: "Reciprocal Fibonacci Constant Approximation",
  description:
    "Compute reciprocal Fibonacci partial sum from F1=F2=1, retaining both unit terms; finite truncation only, not nth Fibonacci or a static reciprocal-Fibonacci constant.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteReciprocalFibonacciSum",
      label: "Finite reciprocal fibonacci sum",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ fibonacciTerms: value.fibonacciTerms as number }),
});
export const run = tool.execute;
export default tool;
