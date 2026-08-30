import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, finiteSet } from "../batch-shared.js";
export type Input = Readonly<{
  readonly membershipFlagsForIntegersOneToN: readonly number[];
}>;
export type Output = Readonly<{
  readonly finiteSchnirelmannPrefixMinimum: number;
  readonly minimumAttainingPrefixLength: number;
  readonly finiteWindowLength: number;
}>;
const inputFields = [
  {
    id: "membershipFlagsForIntegersOneToN",
    label: "Membership flags for integers one to n",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  finiteSet(input.membershipFlagsForIntegersOneToN);
  let s = 0,
    min = 1,
    at = 1;
  input.membershipFlagsForIntegersOneToN.forEach((v, i) => {
    s += v;
    const d = s / (i + 1);
    if (d < min) {
      min = d;
      at = i + 1;
    }
  });
  return {
    finiteSchnirelmannPrefixMinimum: min,
    minimumAttainingPrefixLength: at,
    finiteWindowLength: input.membershipFlagsForIntegersOneToN.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  membershipFlagsForIntegersOneToN: [1, 0, 1, 0],
} satisfies Input;
export const exampleOutput = {
  finiteSchnirelmannPrefixMinimum: 0.5,
  minimumAttainingPrefixLength: 2,
  finiteWindowLength: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/schnirelmann-density",
  title: "Schnirelmann Density Calculator",
  description:
    "Compute minimum observed prefix density over explicit membership of integers 1..N; finite-prefix minimum is an upper bound on global Schnirelmann infimum, not certified infinite-set density.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteSchnirelmannPrefixMinimum",
      label: "Finite schnirelmann prefix minimum",
      kind: "number",
    },
    {
      id: "minimumAttainingPrefixLength",
      label: "Minimum attaining prefix length",
      kind: "number",
    },
    { id: "finiteWindowLength", label: "Finite window length", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      membershipFlagsForIntegersOneToN:
        value.membershipFlagsForIntegersOneToN as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
