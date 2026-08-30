import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, primes } from "../batch-shared.js";
export type Input = Readonly<{ readonly primeCutoff: number }>;
export type Output = Readonly<{
  readonly finiteTwinPrimeEulerProduct: number;
  readonly includedOddPrimeCount: number;
}>;
const inputFields = [
  { id: "primeCutoff", label: "Prime cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const ps = primes(input.primeCutoff).filter((p) => p > 2);
  let log = 0;
  for (const p of ps) log += Math.log1p(-1 / (p - 1) ** 2);
  return {
    finiteTwinPrimeEulerProduct: Math.exp(log),
    includedOddPrimeCount: ps.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { primeCutoff: 7 } satisfies Input;
export const exampleOutput = {
  finiteTwinPrimeEulerProduct: 0.68359375,
  includedOddPrimeCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/twin-prime-constant-approx",
  title: "Twin Prime Constant Approximation",
  description:
    "Compute finite twin-prime constant Euler product over odd primes ≤cutoff using log1p; omitted factors mean finite value is not exact constant or proof of twin-prime infinitude.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteTwinPrimeEulerProduct",
      label: "Finite twin prime euler product",
      kind: "number",
    },
    {
      id: "includedOddPrimeCount",
      label: "Included odd prime count",
      kind: "number",
    },
  ],
  calculate: (value) => calculate({ primeCutoff: value.primeCutoff as number }),
});
export const run = tool.execute;
export default tool;
