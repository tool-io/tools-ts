import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  count,
  totalCount,
  bounded,
} from "../shared.js";
export type Input = Readonly<{
  readonly playedWord: string;
  readonly blankTilePositions: readonly number[];
  readonly callerLetterValuesAtoZ: readonly number[];
}>;
export type Output = Readonly<{
  readonly perTileFaceValues: readonly number[];
  readonly unmultipliedWordFaceValue: number;
}>;
const inputFields = [
  { id: "playedWord", label: "Played word", kind: "string" },
  {
    id: "blankTilePositions",
    label: "Blank tile positions",
    kind: "numberList",
  },
  {
    id: "callerLetterValuesAtoZ",
    label: "Caller letter values ato z",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.blankTilePositions.forEach((v) => count(v, "blankTilePositions"));
  input.callerLetterValuesAtoZ.forEach((v) =>
    count(v, "callerLetterValuesAtoZ"),
  );
  if (
    !/^[A-Z]{1,128}$(?![\s\S])/.test(input.playedWord) ||
    input.callerLetterValuesAtoZ.length !== 26 ||
    new Set(input.blankTilePositions).size !== input.blankTilePositions.length
  )
    simpleError(
      "word",
      "Bounded A–Z tile string, 26 caller values and distinct blank positions required.",
    );
  input.blankTilePositions.forEach((v) =>
    bounded(v, "blank", 0, input.playedWord.length - 1),
  );
  const blank = new Set(input.blankTilePositions),
    v = [...input.playedWord].map((c, i) =>
      blank.has(i) ? 0 : input.callerLetterValuesAtoZ[c.charCodeAt(0) - 65],
    );
  return {
    perTileFaceValues: v,
    unmultipliedWordFaceValue: totalCount(v, "wordFaceValue"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  playedWord: "QUIZ",
  blankTilePositions: [1],
  callerLetterValuesAtoZ: [
    1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4,
    10,
  ],
} satisfies Input;
export const exampleOutput = {
  perTileFaceValues: [10, 0, 1, 10],
  unmultipliedWordFaceValue: 21,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/scrabble-letter-tile-values-lookup",
  title: "Scrabble Letter Tile Values Lookup",
  description:
    "Budget actual Scrabble tile face values under caller alphabet table with explicit zero-value blanks; not dictionary legality, board premiums, crosswords or bingo scoring.",
  inputs: inputFields,
  outputs: [
    {
      id: "perTileFaceValues",
      label: "Per tile face values",
      kind: "numberList",
    },
    {
      id: "unmultipliedWordFaceValue",
      label: "Unmultiplied word face value",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      playedWord: value.playedWord as string,
      blankTilePositions: value.blankTilePositions as readonly number[],
      callerLetterValuesAtoZ: value.callerLetterValuesAtoZ as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
