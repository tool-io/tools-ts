import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, binary, sum } from "../shared.js";
export type Input = Readonly<{
  readonly pieceLetter: string;
  readonly lastSuccessfulActionWasRotation: boolean;
  readonly diagonalCornerOccupiedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly occupiedDiagonalCornerCount: number;
  readonly basicThreeCornerConditionMet: boolean;
  readonly miniVersusFullKickClassificationStillNeeded: boolean;
}>;
const inputFields = [
  { id: "pieceLetter", label: "Piece letter", kind: "string" },
  {
    id: "lastSuccessfulActionWasRotation",
    label: "Last successful action was rotation",
    kind: "boolean",
  },
  {
    id: "diagonalCornerOccupiedFlags",
    label: "Diagonal corner occupied flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !/^[IJLOSTZ]$(?![\s\S])/.test(input.pieceLetter) ||
    input.diagonalCornerOccupiedFlags.length !== 4
  )
    simpleError(
      "piece",
      "Declared tetromino and four observed center-diagonal corners required.",
    );
  binary(input.diagonalCornerOccupiedFlags, "corners");
  const n = sum(input.diagonalCornerOccupiedFlags),
    ok =
      input.pieceLetter === "T" &&
      input.lastSuccessfulActionWasRotation &&
      n >= 3;
  return {
    occupiedDiagonalCornerCount: n,
    basicThreeCornerConditionMet: ok,
    miniVersusFullKickClassificationStillNeeded: ok,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pieceLetter: "T",
  lastSuccessfulActionWasRotation: true,
  diagonalCornerOccupiedFlags: [1, 1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  occupiedDiagonalCornerCount: 3,
  basicThreeCornerConditionMet: true,
  miniVersusFullKickClassificationStillNeeded: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/tetris-t-spin-three-corner-rule-checker",
  title: "T-Spin Three-Corner Rule Check",
  description:
    "Screen observed T placement, last rotation and three blocked diagonal corners only; caller treats walls as blocked. SRS kick exceptions/mini-versus-full, rotation history and game-specific scoring still require review.",
  inputs: inputFields,
  outputs: [
    {
      id: "occupiedDiagonalCornerCount",
      label: "Occupied diagonal corner count",
      kind: "number",
    },
    {
      id: "basicThreeCornerConditionMet",
      label: "Basic three corner condition met",
      kind: "boolean",
    },
    {
      id: "miniVersusFullKickClassificationStillNeeded",
      label: "Mini versus full kick classification still needed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      pieceLetter: value.pieceLetter as string,
      lastSuccessfulActionWasRotation:
        value.lastSuccessfulActionWasRotation as boolean,
      diagonalCornerOccupiedFlags:
        value.diagonalCornerOccupiedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
