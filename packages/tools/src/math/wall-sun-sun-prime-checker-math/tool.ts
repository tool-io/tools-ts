import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  prime,
  fibMod,
} from "../batch-shared.js";
export type Input = Readonly<{ readonly candidatePrime: number }>;
export type Output = Readonly<{
  readonly isPrimeCandidate: boolean;
  readonly testApplicable: boolean;
  readonly fibonacciModuloPrimeSquared: string;
  readonly isWallSunSunPrime: boolean;
}>;
const inputFields = [
  { id: "candidatePrime", label: "Candidate prime", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = bounded(input.candidatePrime, "candidatePrime", 2, 1000000),
    is = prime(p);
  if (!is || p === 2 || p === 5)
    return {
      isPrimeCandidate: is,
      testApplicable: false,
      fibonacciModuloPrimeSquared: "0",
      isWallSunSunPrime: false,
    };
  const symbol = p % 5 === 1 || p % 5 === 4 ? 1 : -1,
    r = fibMod(BigInt(p - symbol), BigInt(p) ** 2n);
  return {
    isPrimeCandidate: true,
    testApplicable: true,
    fibonacciModuloPrimeSquared: r.toString(),
    isWallSunSunPrime: r === 0n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { candidatePrime: 5 } satisfies Input;
export const exampleOutput = {
  isPrimeCandidate: true,
  testApplicable: false,
  fibonacciModuloPrimeSquared: "0",
  isWallSunSunPrime: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/wall-sun-sun-prime-checker-math",
  title: "Wall-Sun-Sun Prime Checker",
  description:
    "Check Fibonacci-Wieferich/Wall–Sun–Sun congruence F_(p−(5/p)) mod p² for actual primes other than 2 and 5 using exact modular doubling; excluded/nonprime inputs explicitly not applicable, no existence claim.",
  inputs: inputFields,
  outputs: [
    { id: "isPrimeCandidate", label: "Is prime candidate", kind: "boolean" },
    { id: "testApplicable", label: "Test applicable", kind: "boolean" },
    {
      id: "fibonacciModuloPrimeSquared",
      label: "Fibonacci modulo prime squared",
      kind: "string",
    },
    {
      id: "isWallSunSunPrime",
      label: "Is wall sun sun prime",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ candidatePrime: value.candidatePrime as number }),
});
export const run = tool.execute;
export default tool;
