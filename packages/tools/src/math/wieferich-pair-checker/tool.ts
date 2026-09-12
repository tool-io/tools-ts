import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  prime,
  modPow,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFirstPrime: number;
  readonly actualSecondPrime: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFirstPrime", label: "Actual first prime", kind: "number" },
  { id: "actualSecondPrime", label: "Actual second prime", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a = bounded(input.actualFirstPrime, "p", 2, 1000000),
    b = bounded(input.actualSecondPrime, "q", 2, 1000000);
  if (a === b || !prime(a) || !prime(b))
    simpleError("primes", "Actualdistinctprimes≤1e6.");
  const x = modPow(BigInt(a), BigInt(b - 1), BigInt(b) ** 2n) === 1n,
    y = modPow(BigInt(b), BigInt(a - 1), BigInt(a) ** 2n) === 1n;
  return {
    firstBaseWieferichAtSecond: x,
    secondBaseWieferichAtFirst: y,
    isMutualWieferichPair: x && y,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFirstPrime: 2, actualSecondPrime: 1093 },
  output: {
    result: {
      firstBaseWieferichAtSecond: true,
      secondBaseWieferichAtFirst: true,
      isMutualWieferichPair: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/wieferich-pair-checker",
  title: "Wieferich Pair Checker",
  description:
    "MutualWieferichprimes modulara^(b\u22121)\u22611modb\u00b2andb^(a\u22121)\u22611moda\u00b2, exactBigIntnot floating powers. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
