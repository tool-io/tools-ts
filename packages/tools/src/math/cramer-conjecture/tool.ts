import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, jumps } from "../batch-shared.js";
export type Input = Readonly<{
  readonly primeCutoff: number;
  readonly callerGapToLogSquaredScreenLimit: number;
}>;
export type Output = Readonly<{
  readonly observedGapToLogSquaredRatios: readonly number[];
  readonly aboveCallerScreenLeftPrimes: readonly number[];
}>;
const inputFields = [
  { id: "primeCutoff", label: "Prime cutoff", kind: "number" },
  {
    id: "callerGapToLogSquaredScreenLimit",
    label: "Caller gap to log squared screen limit",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerGapToLogSquaredScreenLimit,
    "callerGapToLogSquaredScreenLimit",
  );
  const { ps, gaps } = jumps(input.primeCutoff),
    ratios = gaps.map((g, i) => g / Math.log(ps[i]) ** 2);
  return {
    observedGapToLogSquaredRatios: ratios,
    aboveCallerScreenLeftPrimes: ratios.flatMap((v, i) =>
      v > input.callerGapToLogSquaredScreenLimit ? [ps[i]] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  primeCutoff: 13,
  callerGapToLogSquaredScreenLimit: 1,
} satisfies Input;
export const exampleOutput = {
  observedGapToLogSquaredRatios: [
    2.0813689810056077, 1.657070899380446, 0.7721142018083943,
    1.0563660251615101, 0.3478320309940516,
  ],
  aboveCallerScreenLeftPrimes: [2, 3, 7],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/cramer-conjecture",
  title: "Cramér Conjecture Checker",
  description:
    "Screen finite adjacent-prime gap/log²(p) ratios under explicit caller coefficient; Cramér conjecture is asymptotic big-O, not a universal coefficient-one theorem proved/disproved by small primes.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGapToLogSquaredRatios",
      label: "Observed gap to log squared ratios",
      kind: "numberList",
    },
    {
      id: "aboveCallerScreenLeftPrimes",
      label: "Above caller screen left primes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      primeCutoff: value.primeCutoff as number,
      callerGapToLogSquaredScreenLimit:
        value.callerGapToLogSquaredScreenLimit as number,
    }),
});
export const run = tool.execute;
export default tool;
