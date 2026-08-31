import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly physicalTilesPlayed: number;
  readonly rackStartingTileCount: number;
  readonly callerBingoTileThreshold: number;
  readonly callerBingoBonusPoints: number;
}>;
export type Output = Readonly<{
  readonly qualifiesCallerBingo: boolean;
  readonly awardedBingoBonusPoints: number;
}>;
const inputFields = [
  { id: "physicalTilesPlayed", label: "Physical tiles played", kind: "number" },
  {
    id: "rackStartingTileCount",
    label: "Rack starting tile count",
    kind: "number",
  },
  {
    id: "callerBingoTileThreshold",
    label: "Caller bingo tile threshold",
    kind: "number",
  },
  {
    id: "callerBingoBonusPoints",
    label: "Caller bingo bonus points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.physicalTilesPlayed, "physicalTilesPlayed");
  count(input.rackStartingTileCount, "rackStartingTileCount");
  count(input.callerBingoTileThreshold, "callerBingoTileThreshold");
  count(input.callerBingoBonusPoints, "callerBingoBonusPoints");
  if (
    input.physicalTilesPlayed > input.rackStartingTileCount ||
    input.callerBingoTileThreshold < 1
  )
    simpleError(
      "tiles",
      "Cannot play more physical rack tiles than held; positive caller bonus threshold required.",
    );
  const q = input.physicalTilesPlayed >= input.callerBingoTileThreshold;
  return {
    qualifiesCallerBingo: q,
    awardedBingoBonusPoints: q ? input.callerBingoBonusPoints : 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  physicalTilesPlayed: 7,
  rackStartingTileCount: 7,
  callerBingoTileThreshold: 7,
  callerBingoBonusPoints: 50,
} satisfies Input;
export const exampleOutput = {
  qualifiesCallerBingo: true,
  awardedBingoBonusPoints: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/scrabble-bingo-50-point-bonus-checker",
  title: "Scrabble Bingo 50-Point Bonus Check",
  description:
    "Check actual newly played physical tiles, not completed word length or letters represented by blanks, under explicit bingo threshold/points policy.",
  inputs: inputFields,
  outputs: [
    {
      id: "qualifiesCallerBingo",
      label: "Qualifies caller bingo",
      kind: "boolean",
    },
    {
      id: "awardedBingoBonusPoints",
      label: "Awarded bingo bonus points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      physicalTilesPlayed: value.physicalTilesPlayed as number,
      rackStartingTileCount: value.rackStartingTileCount as number,
      callerBingoTileThreshold: value.callerBingoTileThreshold as number,
      callerBingoBonusPoints: value.callerBingoBonusPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
