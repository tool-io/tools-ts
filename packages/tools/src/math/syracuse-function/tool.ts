import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  exactDecimal,
} from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualPositiveOddDecimal: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPositiveOddDecimal",
    label: "Actual positive odd decimal",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  let x = exactDecimal(input.actualPositiveOddDecimal);
  if (x === 0n || x % 2n === 0n) simpleError("n", "Actualpositiveoddstart.");
  x = 3n * x + 1n;
  while (x % 2n === 0n) x /= 2n;
  return { exactNextOddSyracuseDecimal: x.toString() };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPositiveOddDecimal: "7" },
  output: { result: { exactNextOddSyracuseDecimal: "11" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/syracuse-function",
  title: "Syracuse Function Calculator",
  description:
    "Exact acceleratedoddCollatz/Syracuse(3n+1)/2^v2, not unaccelerated Collatz single-stepor global termination. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
