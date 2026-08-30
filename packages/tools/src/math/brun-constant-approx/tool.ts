import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, primes } from "../batch-shared.js";
export type Input = Readonly<{ readonly primeCutoff: number }>;
export type Output = Readonly<{
  readonly finiteBrunReciprocalSum: number;
  readonly observedTwinPrimePairCount: number;
}>;
const inputFields = [
  { id: "primeCutoff", label: "Prime cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const ps = primes(input.primeCutoff),
    set = new Set(ps);
  let sum = 0,
    count = 0;
  for (const p of ps)
    if (set.has(p + 2)) {
      sum += 1 / p + 1 / (p + 2);
      count++;
    }
  return { finiteBrunReciprocalSum: sum, observedTwinPrimePairCount: count };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { primeCutoff: 7 } satisfies Input;
export const exampleOutput = {
  finiteBrunReciprocalSum: 0.8761904761904762,
  observedTwinPrimePairCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/brun-constant-approx",
  title: "Brun Constant Approximation",
  description:
    "Compute finite Brun reciprocal sum over actual twin pairs with both primes ≤cutoff; shared prime 5 contributes in both pairs, no extrapolated Brun constant or tail estimate.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteBrunReciprocalSum",
      label: "Finite brun reciprocal sum",
      kind: "number",
    },
    {
      id: "observedTwinPrimePairCount",
      label: "Observed twin prime pair count",
      kind: "number",
    },
  ],
  calculate: (value) => calculate({ primeCutoff: value.primeCutoff as number }),
});
export const run = tool.execute;
export default tool;
