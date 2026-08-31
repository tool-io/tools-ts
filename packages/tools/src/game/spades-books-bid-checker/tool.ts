import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  bounded,
} from "../shared.js";
export type Input = Readonly<{
  readonly teamBidBooks: number;
  readonly teamWonBooks: number;
  readonly priorBagCount: number;
  readonly callerPointsPerBidBook: number;
  readonly callerPointsPerOvertrick: number;
  readonly callerBagPenaltyThreshold: number;
  readonly callerBagPenaltyPoints: number;
}>;
export type Output = Readonly<{
  readonly contractMade: boolean;
  readonly overtrickBagCount: number;
  readonly newCarriedBagCount: number;
  readonly bagPenaltyCycles: number;
  readonly signedRoundScore: number;
}>;
const inputFields = [
  { id: "teamBidBooks", label: "Team bid books", kind: "number" },
  { id: "teamWonBooks", label: "Team won books", kind: "number" },
  { id: "priorBagCount", label: "Prior bag count", kind: "number" },
  {
    id: "callerPointsPerBidBook",
    label: "Caller points per bid book",
    kind: "number",
  },
  {
    id: "callerPointsPerOvertrick",
    label: "Caller points per overtrick",
    kind: "number",
  },
  {
    id: "callerBagPenaltyThreshold",
    label: "Caller bag penalty threshold",
    kind: "number",
  },
  {
    id: "callerBagPenaltyPoints",
    label: "Caller bag penalty points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerPointsPerBidBook, "callerPointsPerBidBook");
  nonnegative(input.callerPointsPerOvertrick, "callerPointsPerOvertrick");
  nonnegative(input.callerBagPenaltyPoints, "callerBagPenaltyPoints");
  count(input.priorBagCount, "priorBagCount");
  count(input.callerBagPenaltyThreshold, "callerBagPenaltyThreshold");
  bounded(input.teamBidBooks, "bid", 0, 13);
  bounded(input.teamWonBooks, "won", 0, 13);
  bounded(input.callerBagPenaltyThreshold, "threshold", 1, 1000);
  if (input.priorBagCount >= input.callerBagPenaltyThreshold)
    simpleError(
      "bags",
      "Carried bags must already be reduced modulo caller threshold.",
    );
  const made = input.teamWonBooks >= input.teamBidBooks,
    over = made ? input.teamWonBooks - input.teamBidBooks : 0,
    total = input.priorBagCount + over,
    cycles = Math.floor(total / input.callerBagPenaltyThreshold);
  return {
    contractMade: made,
    overtrickBagCount: over,
    newCarriedBagCount: total % input.callerBagPenaltyThreshold,
    bagPenaltyCycles: cycles,
    signedRoundScore:
      (made ? 1 : -1) * input.teamBidBooks * input.callerPointsPerBidBook +
      over * input.callerPointsPerOvertrick -
      cycles * input.callerBagPenaltyPoints,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  teamBidBooks: 5,
  teamWonBooks: 7,
  priorBagCount: 9,
  callerPointsPerBidBook: 10,
  callerPointsPerOvertrick: 1,
  callerBagPenaltyThreshold: 10,
  callerBagPenaltyPoints: 100,
} satisfies Input;
export const exampleOutput = {
  contractMade: true,
  overtrickBagCount: 2,
  newCarriedBagCount: 1,
  bagPenaltyCycles: 1,
  signedRoundScore: -48,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/spades-books-bid-checker",
  title: "Spades Books & Bid Check",
  description:
    "Score explicit team books versus bid with caller contract/overtrick/bag-cycle rules and carried bags; nil/blind-nil and individual-player penalties are outside this contract.",
  inputs: inputFields,
  outputs: [
    { id: "contractMade", label: "Contract made", kind: "boolean" },
    { id: "overtrickBagCount", label: "Overtrick bag count", kind: "number" },
    {
      id: "newCarriedBagCount",
      label: "New carried bag count",
      kind: "number",
    },
    { id: "bagPenaltyCycles", label: "Bag penalty cycles", kind: "number" },
    { id: "signedRoundScore", label: "Signed round score", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      teamBidBooks: value.teamBidBooks as number,
      teamWonBooks: value.teamWonBooks as number,
      priorBagCount: value.priorBagCount as number,
      callerPointsPerBidBook: value.callerPointsPerBidBook as number,
      callerPointsPerOvertrick: value.callerPointsPerOvertrick as number,
      callerBagPenaltyThreshold: value.callerBagPenaltyThreshold as number,
      callerBagPenaltyPoints: value.callerBagPenaltyPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
