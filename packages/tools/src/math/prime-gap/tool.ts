import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  primes,
  prime,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualLowerPrime: number;
  readonly actualUpperPrime: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualLowerPrime", label: "Actual lower prime", kind: "number" },
  { id: "actualUpperPrime", label: "Actual upper prime", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a = bounded(input.actualLowerPrime, "p", 2, 1000000),
    b = bounded(input.actualUpperPrime, "q", 2, 1000000);
  if (a >= b || !prime(a) || !prime(b) || primes(b).some((p) => p > a && p < b))
    simpleError("pair", "Actualconsecutiveorderedprimes.");
  return { exactConsecutivePrimeGap: b - a };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualLowerPrime: 7, actualUpperPrime: 11 },
  output: { result: { exactConsecutivePrimeGap: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/prime-gap",
  title: "Prime Gap Calculator",
  description:
    "Exact validated consecutive prime gap not running record maximum sieve. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
