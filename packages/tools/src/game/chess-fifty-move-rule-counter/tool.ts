import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, binary } from "../shared.js";
export type Input = Readonly<{
  readonly startingHalfmoveClock: number;
  readonly pawnMoveOrCaptureFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly finalHalfmoveClock: number;
  readonly threefoldIndependentFiftyMoveClaimCandidate: boolean;
  readonly seventyFiveMoveAutomaticDrawCandidate: boolean;
}>;
const inputFields = [
  {
    id: "startingHalfmoveClock",
    label: "Starting halfmove clock",
    kind: "number",
  },
  {
    id: "pawnMoveOrCaptureFlags",
    label: "Pawn move or capture flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.startingHalfmoveClock, "startingHalfmoveClock");
  binary(input.pawnMoveOrCaptureFlags, "events");
  let c = input.startingHalfmoveClock;
  input.pawnMoveOrCaptureFlags.forEach((v) => {
    c = v ? 0 : count(c + 1, "halfmoveClock");
  });
  return {
    finalHalfmoveClock: c,
    threefoldIndependentFiftyMoveClaimCandidate: c >= 100,
    seventyFiveMoveAutomaticDrawCandidate: c >= 150,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  startingHalfmoveClock: 99,
  pawnMoveOrCaptureFlags: [0, 0],
} satisfies Input;
export const exampleOutput = {
  finalHalfmoveClock: 101,
  threefoldIndependentFiftyMoveClaimCandidate: true,
  seventyFiveMoveAutomaticDrawCandidate: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/chess-fifty-move-rule-counter",
  title: "Fifty-Move Rule Counter",
  description:
    "Update halfmove ledger after supplied pawn-move/capture flags; 100/150 plies indicate claim/automatic-draw candidates only, with checkmate precedence and claim procedure not verified. Independent of repetition.",
  inputs: inputFields,
  outputs: [
    { id: "finalHalfmoveClock", label: "Final halfmove clock", kind: "number" },
    {
      id: "threefoldIndependentFiftyMoveClaimCandidate",
      label: "Threefold independent fifty move claim candidate",
      kind: "boolean",
    },
    {
      id: "seventyFiveMoveAutomaticDrawCandidate",
      label: "Seventy five move automatic draw candidate",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      startingHalfmoveClock: value.startingHalfmoveClock as number,
      pawnMoveOrCaptureFlags: value.pawnMoveOrCaptureFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
