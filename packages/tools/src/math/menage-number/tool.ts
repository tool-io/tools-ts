import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  choose,
  factorial,
} from "../batch-shared.js";
export type Input = Readonly<{ readonly coupleCount: number }>;
export type Output = Readonly<{ readonly exactMenageArrangementCount: string }>;
const inputFields = [
  { id: "coupleCount", label: "Couple count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.coupleCount, "coupleCount", 2, 64);
  let result = 0n;
  for (let k = 0; k <= n; k++) {
    const denominator = BigInt(2 * n - k),
      num = BigInt(2 * n) * choose(2 * n - k, k) * factorial(n - k);
    result += (k % 2 ? -1n : 1n) * (num / denominator);
  }
  return { exactMenageArrangementCount: result.toString() };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { coupleCount: 3 } satisfies Input;
export const exampleOutput = {
  exactMenageArrangementCount: "1",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/menage-number",
  title: "Ménage Number Calculator",
  description:
    "Count reduced circular ménage arrangements with one sex fixed in circular order and opposite-sex placements avoiding adjacent spouses; n≥2, no extra rotation/sex arrangement multiplier.",
  inputs: inputFields,
  outputs: [
    {
      id: "exactMenageArrangementCount",
      label: "Exact menage arrangement count",
      kind: "string",
    },
  ],
  calculate: (value) => calculate({ coupleCount: value.coupleCount as number }),
});
export const run = tool.execute;
export default tool;
