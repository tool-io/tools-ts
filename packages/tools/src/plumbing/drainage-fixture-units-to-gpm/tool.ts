import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  sum,
  interpolate,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerObservedDrainageFixtureUnitsByBranch: readonly number[];
  readonly callerVerifiedDfuKnots: readonly number[];
  readonly callerVerifiedBranchGpmKnots: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerInterpolatedBranchGpm: readonly number[];
  readonly sumIndependentBranchGpm: number;
}>;
const inputFields = [
  {
    id: "callerObservedDrainageFixtureUnitsByBranch",
    label: "Caller observed drainage fixture units by branch",
    kind: "numberList",
  },
  {
    id: "callerVerifiedDfuKnots",
    label: "Caller verified dfu knots",
    kind: "numberList",
  },
  {
    id: "callerVerifiedBranchGpmKnots",
    label: "Caller verified branch gpm knots",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerObservedDrainageFixtureUnitsByBranch.forEach((v) =>
    nonnegative(v, "callerObservedDrainageFixtureUnitsByBranch"),
  );
  input.callerVerifiedDfuKnots.forEach((v) =>
    nonnegative(v, "callerVerifiedDfuKnots"),
  );
  input.callerVerifiedBranchGpmKnots.forEach((v) =>
    nonnegative(v, "callerVerifiedBranchGpmKnots"),
  );
  const flows = input.callerObservedDrainageFixtureUnitsByBranch.map((v) =>
    interpolate(
      input.callerVerifiedDfuKnots,
      input.callerVerifiedBranchGpmKnots,
      v,
    ),
  );
  return {
    callerInterpolatedBranchGpm: flows,
    sumIndependentBranchGpm: sum(flows),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedDrainageFixtureUnitsByBranch: [2, 4],
  callerVerifiedDfuKnots: [0, 4, 8],
  callerVerifiedBranchGpmKnots: [0, 10, 16],
} satisfies Input;
export const exampleOutput = {
  callerInterpolatedBranchGpm: [5, 10],
  sumIndependentBranchGpm: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/drainage-fixture-units-to-gpm",
  title: "Plumbing Drainage Fixture Units To Gpm Calculator",
  description:
    "Interpolate actual branch drainage fixture-unit demands using independently verified caller DFU→GPM table; simultaneous branch sum explicitly assumed, not universal supply Hunter units or jurisdiction code.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerInterpolatedBranchGpm",
      label: "Caller interpolated branch gpm",
      kind: "numberList",
    },
    {
      id: "sumIndependentBranchGpm",
      label: "Sum independent branch gpm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedDrainageFixtureUnitsByBranch:
        value.callerObservedDrainageFixtureUnitsByBranch as readonly number[],
      callerVerifiedDfuKnots: value.callerVerifiedDfuKnots as readonly number[],
      callerVerifiedBranchGpmKnots:
        value.callerVerifiedBranchGpmKnots as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
