import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, integer } from "../batch-shared.js";
export type Input = Readonly<{ readonly signedOutOfBalanceMinor: number }>;
export type Output = Readonly<{
  readonly divisibleByNineTranspositionCandidate: boolean;
  readonly evenDifferenceDoublePostingCandidate: boolean;
  readonly absoluteHalfDifferenceMinor: number;
}>;
const inputFields = [
  {
    id: "signedOutOfBalanceMinor",
    label: "Signed out of balance minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  integer(input.signedOutOfBalanceMinor, "signedOutOfBalanceMinor");
  const gap = Math.abs(input.signedOutOfBalanceMinor),
    even = gap > 0 && gap % 2 === 0;
  return {
    divisibleByNineTranspositionCandidate: gap > 0 && gap % 9 === 0,
    evenDifferenceDoublePostingCandidate: even,
    absoluteHalfDifferenceMinor: even ? gap / 2 : -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { signedOutOfBalanceMinor: 54 } satisfies Input;
export const exampleOutput = {
  divisibleByNineTranspositionCandidate: true,
  evenDifferenceDoublePostingCandidate: true,
  absoluteHalfDifferenceMinor: 27,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/out-of-balance-difference-transposition-halver",
  title: "Out Of Balance Difference Transposition Halver Trick Tool",
  description:
    "Screen an exact signed minor-unit imbalance for arithmetic nine-divisibility/transposition and halving candidates; these are search clues only, not proof of a digit transposition, duplicated entry or correct account.",
  inputs: inputFields,
  outputs: [
    {
      id: "divisibleByNineTranspositionCandidate",
      label: "Divisible by nine transposition candidate",
      kind: "boolean",
    },
    {
      id: "evenDifferenceDoublePostingCandidate",
      label: "Even difference double posting candidate",
      kind: "boolean",
    },
    {
      id: "absoluteHalfDifferenceMinor",
      label: "Absolute half difference minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      signedOutOfBalanceMinor: value.signedOutOfBalanceMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
