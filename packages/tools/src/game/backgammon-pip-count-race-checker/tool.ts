import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, sum } from "../shared.js";
export type Input = Readonly<{
  readonly whiteCheckerCountsAtDistanceOneToTwentyFour: readonly number[];
  readonly blackCheckerCountsAtDistanceOneToTwentyFour: readonly number[];
  readonly whiteBorneOffCount: number;
  readonly blackBorneOffCount: number;
}>;
export type Output = Readonly<{
  readonly whiteRacePipCount: number;
  readonly blackRacePipCount: number;
  readonly signedWhiteMinusBlackPips: number;
}>;
const inputFields = [
  {
    id: "whiteCheckerCountsAtDistanceOneToTwentyFour",
    label: "White checker counts at distance one to twenty four",
    kind: "numberList",
  },
  {
    id: "blackCheckerCountsAtDistanceOneToTwentyFour",
    label: "Black checker counts at distance one to twenty four",
    kind: "numberList",
  },
  { id: "whiteBorneOffCount", label: "White borne off count", kind: "number" },
  { id: "blackBorneOffCount", label: "Black borne off count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.whiteCheckerCountsAtDistanceOneToTwentyFour.forEach((v) =>
    count(v, "whiteCheckerCountsAtDistanceOneToTwentyFour"),
  );
  input.blackCheckerCountsAtDistanceOneToTwentyFour.forEach((v) =>
    count(v, "blackCheckerCountsAtDistanceOneToTwentyFour"),
  );
  count(input.whiteBorneOffCount, "whiteBorneOffCount");
  count(input.blackBorneOffCount, "blackBorneOffCount");
  if (
    input.whiteCheckerCountsAtDistanceOneToTwentyFour.length !== 24 ||
    input.blackCheckerCountsAtDistanceOneToTwentyFour.length !== 24 ||
    sum(input.whiteCheckerCountsAtDistanceOneToTwentyFour) +
      input.whiteBorneOffCount !==
      15 ||
    sum(input.blackCheckerCountsAtDistanceOneToTwentyFour) +
      input.blackBorneOffCount !==
      15
  )
    simpleError(
      "inventory",
      "Exact 15-checker race-only inventories with no bar required.",
    );
  const calc = (v: readonly number[]) =>
      v.reduce((s, n, i) => s + n * (i + 1), 0),
    w = calc(input.whiteCheckerCountsAtDistanceOneToTwentyFour),
    b = calc(input.blackCheckerCountsAtDistanceOneToTwentyFour);
  return {
    whiteRacePipCount: w,
    blackRacePipCount: b,
    signedWhiteMinusBlackPips: w - b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  whiteCheckerCountsAtDistanceOneToTwentyFour: [
    0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  blackCheckerCountsAtDistanceOneToTwentyFour: [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  whiteBorneOffCount: 13,
  blackBorneOffCount: 14,
} satisfies Input;
export const exampleOutput = {
  whiteRacePipCount: 11,
  blackRacePipCount: 1,
  signedWhiteMinusBlackPips: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/backgammon-pip-count-race-checker",
  title: "Backgammon Pip Count Race Check",
  description:
    "Reconcile race-only 15-checker inventories using each side relative home distance, borne-off zero pips; no bar/contact/hit analysis or win probability from pip difference.",
  inputs: inputFields,
  outputs: [
    { id: "whiteRacePipCount", label: "White race pip count", kind: "number" },
    { id: "blackRacePipCount", label: "Black race pip count", kind: "number" },
    {
      id: "signedWhiteMinusBlackPips",
      label: "Signed white minus black pips",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      whiteCheckerCountsAtDistanceOneToTwentyFour:
        value.whiteCheckerCountsAtDistanceOneToTwentyFour as readonly number[],
      blackCheckerCountsAtDistanceOneToTwentyFour:
        value.blackCheckerCountsAtDistanceOneToTwentyFour as readonly number[],
      whiteBorneOffCount: value.whiteBorneOffCount as number,
      blackBorneOffCount: value.blackBorneOffCount as number,
    }),
});
export const run = tool.execute;
export default tool;
