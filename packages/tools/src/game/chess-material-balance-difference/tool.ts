import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  ordered,
  sum,
  at,
} from "../shared.js";
export type Input = Readonly<{
  readonly whiteCountsPawnKnightBishopRookQueen: readonly number[];
  readonly blackCountsPawnKnightBishopRookQueen: readonly number[];
  readonly callerPieceValues: readonly number[];
}>;
export type Output = Readonly<{
  readonly whiteMaterialValue: number;
  readonly blackMaterialValue: number;
  readonly signedWhiteMaterialBalance: number;
}>;
const inputFields = [
  {
    id: "whiteCountsPawnKnightBishopRookQueen",
    label: "White counts pawn knight bishop rook queen",
    kind: "numberList",
  },
  {
    id: "blackCountsPawnKnightBishopRookQueen",
    label: "Black counts pawn knight bishop rook queen",
    kind: "numberList",
  },
  { id: "callerPieceValues", label: "Caller piece values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerPieceValues.forEach((v) => positive(v, "callerPieceValues"));
  input.whiteCountsPawnKnightBishopRookQueen.forEach((v) =>
    count(v, "whiteCountsPawnKnightBishopRookQueen"),
  );
  input.blackCountsPawnKnightBishopRookQueen.forEach((v) =>
    count(v, "blackCountsPawnKnightBishopRookQueen"),
  );
  if (
    [
      input.whiteCountsPawnKnightBishopRookQueen,
      input.blackCountsPawnKnightBishopRookQueen,
      input.callerPieceValues,
    ].some((v) => v.length !== 5) ||
    sum(input.whiteCountsPawnKnightBishopRookQueen) > 15 ||
    sum(input.blackCountsPawnKnightBishopRookQueen) > 15
  )
    simpleError(
      "inventory",
      "Five ordered material counts and at most fifteen nonking pieces per side required.",
    );
  const w = input.whiteCountsPawnKnightBishopRookQueen.reduce(
      (s, v, i) => s + v * input.callerPieceValues[i],
      0,
    ),
    b = input.blackCountsPawnKnightBishopRookQueen.reduce(
      (s, v, i) => s + v * input.callerPieceValues[i],
      0,
    );
  return {
    whiteMaterialValue: w,
    blackMaterialValue: b,
    signedWhiteMaterialBalance: w - b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  whiteCountsPawnKnightBishopRookQueen: [8, 2, 2, 2, 1],
  blackCountsPawnKnightBishopRookQueen: [7, 2, 2, 2, 1],
  callerPieceValues: [1, 3, 3, 5, 9],
} satisfies Input;
export const exampleOutput = {
  whiteMaterialValue: 39,
  blackMaterialValue: 38,
  signedWhiteMaterialBalance: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/chess-material-balance-difference",
  title: "Chess Material Balance Difference",
  description:
    "Reconcile caller pawn/knight/bishop/rook/queen inventories and explicit relative values; king excluded, promotions allowed within inventory, material balance is not position evaluation.",
  inputs: inputFields,
  outputs: [
    { id: "whiteMaterialValue", label: "White material value", kind: "number" },
    { id: "blackMaterialValue", label: "Black material value", kind: "number" },
    {
      id: "signedWhiteMaterialBalance",
      label: "Signed white material balance",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      whiteCountsPawnKnightBishopRookQueen:
        value.whiteCountsPawnKnightBishopRookQueen as readonly number[],
      blackCountsPawnKnightBishopRookQueen:
        value.blackCountsPawnKnightBishopRookQueen as readonly number[],
      callerPieceValues: value.callerPieceValues as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
