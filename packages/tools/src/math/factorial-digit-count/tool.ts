import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, factorial } from "../batch-shared.js";
export type Input = Readonly<{
  readonly factorialIndex: number;
  readonly radix: number;
}>;
export type Output = Readonly<{ readonly exactFactorialDigitCount: number }>;
const inputFields = [
  { id: "factorialIndex", label: "Factorial index", kind: "number" },
  { id: "radix", label: "Radix", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.factorialIndex, "factorialIndex", 0, 2000),
    b = bounded(input.radix, "radix", 2, 36);
  return { exactFactorialDigitCount: factorial(n).toString(b).length };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { factorialIndex: 10, radix: 10 } satisfies Input;
export const exampleOutput = { exactFactorialDigitCount: 7 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/factorial-digit-count",
  title: "Factorial Digit Count Calculator",
  description:
    "Count exact radix digits of n! using bounded BigInt factorial, avoiding logarithm rounding at powers of base; 0!=1 has one digit.",
  inputs: inputFields,
  outputs: [
    {
      id: "exactFactorialDigitCount",
      label: "Exact factorial digit count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      factorialIndex: value.factorialIndex as number,
      radix: value.radix as number,
    }),
});
export const run = tool.execute;
export default tool;
