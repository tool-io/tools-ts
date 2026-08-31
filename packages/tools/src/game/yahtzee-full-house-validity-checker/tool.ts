import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, dice, frequencies } from "../shared.js";
export type Input = Readonly<{
  readonly fiveDice: readonly number[];
  readonly callerYahtzeeCountsAsFullHouse: boolean;
}>;
export type Output = Readonly<{
  readonly validFullHouse: boolean;
  readonly multiplicitySignature: readonly number[];
}>;
const inputFields = [
  { id: "fiveDice", label: "Five dice", kind: "numberList" },
  {
    id: "callerYahtzeeCountsAsFullHouse",
    label: "Caller yahtzee counts as full house",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  dice(input.fiveDice);
  const c = [...frequencies(input.fiveDice).values()].sort((a, b) => b - a);
  return {
    validFullHouse:
      c.join(",") === "3,2" ||
      (input.callerYahtzeeCountsAsFullHouse && c[0] === 5),
    multiplicitySignature: c,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fiveDice: [2, 2, 3, 3, 3],
  callerYahtzeeCountsAsFullHouse: false,
} satisfies Input;
export const exampleOutput = {
  validFullHouse: true,
  multiplicitySignature: [3, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/yahtzee-full-house-validity-checker",
  title: "Yahtzee Full House Validity Check",
  description:
    "Check exact 3+2 observed dice multiplicities, with explicit all-five-equal variant switch rather than silently conflating Yahtzee/joker rules.",
  inputs: inputFields,
  outputs: [
    { id: "validFullHouse", label: "Valid full house", kind: "boolean" },
    {
      id: "multiplicitySignature",
      label: "Multiplicity signature",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      fiveDice: value.fiveDice as readonly number[],
      callerYahtzeeCountsAsFullHouse:
        value.callerYahtzeeCountsAsFullHouse as boolean,
    }),
});
export const run = tool.execute;
export default tool;
