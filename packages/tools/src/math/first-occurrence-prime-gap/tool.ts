import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, jumps } from "../batch-shared.js";
export type Input = Readonly<{
  readonly primeCutoff: number;
  readonly targetGapSize: number;
}>;
export type Output = Readonly<{
  readonly firstObservedGapFound: boolean;
  readonly firstObservedGapLeftPrime: number;
  readonly firstObservedGapRightPrime: number;
}>;
const inputFields = [
  { id: "primeCutoff", label: "Prime cutoff", kind: "number" },
  { id: "targetGapSize", label: "Target gap size", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const g = bounded(input.targetGapSize, "gap", 1, 1000000),
    { ps, gaps } = jumps(input.primeCutoff),
    i = gaps.indexOf(g);
  return {
    firstObservedGapFound: i !== -1,
    firstObservedGapLeftPrime: i === -1 ? -1 : ps[i],
    firstObservedGapRightPrime: i === -1 ? -1 : ps[i + 1],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  primeCutoff: 13,
  targetGapSize: 4,
} satisfies Input;
export const exampleOutput = {
  firstObservedGapFound: true,
  firstObservedGapLeftPrime: 7,
  firstObservedGapRightPrime: 11,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/first-occurrence-prime-gap",
  title: "First Occurrence Prime Gap Calculator",
  description:
    "Find first exact target gap between adjacent actual primes in complete sieve up to caller cutoff; missing observation is found=false/-1 rather than proof target never occurs.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstObservedGapFound",
      label: "First observed gap found",
      kind: "boolean",
    },
    {
      id: "firstObservedGapLeftPrime",
      label: "First observed gap left prime",
      kind: "number",
    },
    {
      id: "firstObservedGapRightPrime",
      label: "First observed gap right prime",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      primeCutoff: value.primeCutoff as number,
      targetGapSize: value.targetGapSize as number,
    }),
});
export const run = tool.execute;
export default tool;
