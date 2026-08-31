import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, dice } from "../shared.js";
export type Input = Readonly<{ readonly fiveDice: readonly number[] }>;
export type Output = Readonly<{
  readonly validLargeStraight: boolean;
  readonly straightHighFace: number;
}>;
const inputFields = [
  { id: "fiveDice", label: "Five dice", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  dice(input.fiveDice);
  const sorted = [...new Set(input.fiveDice)].sort((a, b) => a - b),
    valid = sorted.length === 5 && sorted[4] - sorted[0] === 4;
  return {
    validLargeStraight: valid,
    straightHighFace: valid ? sorted[4] : -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { fiveDice: [2, 3, 4, 5, 6] } satisfies Input;
export const exampleOutput = {
  validLargeStraight: true,
  straightHighFace: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/yahtzee-large-straight-validity-checker",
  title: "Yahtzee Large Straight Validity Check",
  description:
    "Validate five distinct consecutive fair-d6 outcomes as observed large straight; duplicates and missing endpoints remain false, no joker substitution.",
  inputs: inputFields,
  outputs: [
    {
      id: "validLargeStraight",
      label: "Valid large straight",
      kind: "boolean",
    },
    { id: "straightHighFace", label: "Straight high face", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ fiveDice: value.fiveDice as readonly number[] }),
});
export const run = tool.execute;
export default tool;
