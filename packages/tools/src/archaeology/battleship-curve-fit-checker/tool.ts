import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, shape } from "../shared.js";
export type Input = Readonly<{
  readonly orderedTypeFrequencies: readonly (readonly number[])[];
  readonly callerTolerance: number;
}>;
export type Output = Readonly<{
  readonly unimodalColumnFlags: readonly number[];
  readonly directionReversalCounts: readonly number[];
}>;
const inputFields = [
  {
    id: "orderedTypeFrequencies",
    label: "Ordered type frequencies",
    kind: "matrix",
  },
  { id: "callerTolerance", label: "Caller tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerTolerance, "callerTolerance");
  const m = shape(input.orderedTypeFrequencies, "orderedTypeFrequencies");
  input.orderedTypeFrequencies.forEach((row) =>
    row.forEach((v) => nonnegative(v, "frequencies")),
  );
  const unimodalColumnFlags: number[] = [],
    directionReversalCounts: number[] = [];
  for (let j = 0; j < m; j++) {
    let last = 0,
      turns = 0,
      declining = false,
      ok = true;
    for (let i = 1; i < input.orderedTypeFrequencies.length; i++) {
      const d =
          input.orderedTypeFrequencies[i][j] -
          input.orderedTypeFrequencies[i - 1][j],
        sign = Math.abs(d) <= input.callerTolerance ? 0 : Math.sign(d);
      if (!sign) continue;
      if (last && last !== sign) turns++;
      if (sign < 0) declining = true;
      if (sign > 0 && declining) ok = false;
      last = sign;
    }
    unimodalColumnFlags.push(ok ? 1 : 0);
    directionReversalCounts.push(turns);
  }
  return { unimodalColumnFlags, directionReversalCounts };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orderedTypeFrequencies: [
    [0, 1],
    [2, 2],
    [1, 3],
    [2, 2],
  ],
  callerTolerance: 0,
} satisfies Input;
export const exampleOutput = {
  unimodalColumnFlags: [0, 1],
  directionReversalCounts: [2, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/battleship-curve-fit-checker",
  title: "Battleship Curve Fit Checker",
  description:
    "Check each type-frequency column in a supplied ordering for nondecreasing-then-nonincreasing battleship shape under caller tolerance; monotone and plateau series are accepted, not proof of chronology.",
  inputs: inputFields,
  outputs: [
    {
      id: "unimodalColumnFlags",
      label: "Unimodal column flags",
      kind: "numberList",
    },
    {
      id: "directionReversalCounts",
      label: "Direction reversal counts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      orderedTypeFrequencies:
        value.orderedTypeFrequencies as readonly (readonly number[])[],
      callerTolerance: value.callerTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
