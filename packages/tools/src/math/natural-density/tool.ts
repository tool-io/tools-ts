import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, finiteSet } from "../batch-shared.js";
export type Input = Readonly<{
  readonly membershipFlagsForIntegersOneToN: readonly number[];
}>;
export type Output = Readonly<{
  readonly finiteWindowDensity: number;
  readonly observedMemberCount: number;
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
  const n = input.membershipFlagsForIntegersOneToN.reduce((a, b) => a + b, 0);
  return {
    finiteWindowDensity: n / input.membershipFlagsForIntegersOneToN.length,
    observedMemberCount: n,
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
  finiteWindowDensity: 0.5,
  observedMemberCount: 2,
  finiteWindowLength: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/natural-density",
  title: "Natural Density Calculator",
  description:
    "Compute density at a finite declared integer cutoff from complete binary membership; not global prefix infimum or proof that infinite natural-density limit exists.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteWindowDensity",
      label: "Finite window density",
      kind: "number",
    },
    {
      id: "observedMemberCount",
      label: "Observed member count",
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
