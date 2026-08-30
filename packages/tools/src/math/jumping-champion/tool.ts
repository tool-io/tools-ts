import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, jumps } from "../batch-shared.js";
export type Input = Readonly<{ readonly primeCutoff: number }>;
export type Output = Readonly<{
  readonly mostFrequentObservedGapSizes: readonly number[];
  readonly observedMaximumGapFrequency: number;
  readonly totalObservedAdjacentGaps: number;
}>;
const inputFields = [
  { id: "primeCutoff", label: "Prime cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const { gaps } = jumps(input.primeCutoff),
    freq = new Map<number, number>();
  gaps.forEach((g) => freq.set(g, (freq.get(g) ?? 0) + 1));
  const max = freq.size ? Math.max(...freq.values()) : 0;
  return {
    mostFrequentObservedGapSizes: [...freq.keys()]
      .filter((k) => freq.get(k) === max)
      .sort((a, b) => a - b),
    observedMaximumGapFrequency: max,
    totalObservedAdjacentGaps: gaps.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { primeCutoff: 13 } satisfies Input;
export const exampleOutput = {
  mostFrequentObservedGapSizes: [2],
  observedMaximumGapFrequency: 3,
  totalObservedAdjacentGaps: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/jumping-champion",
  title: "Jumping Champion Calculator",
  description:
    "Return all tied finite prime-gap frequency champions below actual sieve cutoff; not largest-gap record, asymptotic jumping champion or conjecture proof.",
  inputs: inputFields,
  outputs: [
    {
      id: "mostFrequentObservedGapSizes",
      label: "Most frequent observed gap sizes",
      kind: "numberList",
    },
    {
      id: "observedMaximumGapFrequency",
      label: "Observed maximum gap frequency",
      kind: "number",
    },
    {
      id: "totalObservedAdjacentGaps",
      label: "Total observed adjacent gaps",
      kind: "number",
    },
  ],
  calculate: (value) => calculate({ primeCutoff: value.primeCutoff as number }),
});
export const run = tool.execute;
export default tool;
