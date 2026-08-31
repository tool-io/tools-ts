import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, cards } from "../shared.js";
export type Input = Readonly<{
  readonly thirteenCardHand: readonly string[];
  readonly callerOpeningHcpThreshold: number;
}>;
export type Output = Readonly<{
  readonly highCardPoints: number;
  readonly suitCountsSpadesHeartsDiamondsClubs: readonly number[];
  readonly meetsCallerOpeningHcpThreshold: boolean;
}>;
const inputFields = [
  { id: "thirteenCardHand", label: "Thirteen card hand", kind: "stringList" },
  {
    id: "callerOpeningHcpThreshold",
    label: "Caller opening hcp threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerOpeningHcpThreshold, "callerOpeningHcpThreshold");
  const hand = cards(input.thirteenCardHand, 13),
    hcp = hand.reduce((s, c) => s + Math.max(0, c.rank - 10), 0);
  return {
    highCardPoints: hcp,
    suitCountsSpadesHeartsDiamondsClubs: ["S", "H", "D", "C"].map(
      (s) => hand.filter((c) => c.suit === s).length,
    ),
    meetsCallerOpeningHcpThreshold: hcp >= input.callerOpeningHcpThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  thirteenCardHand: [
    "AS",
    "KS",
    "QS",
    "JS",
    "TS",
    "9S",
    "8S",
    "7S",
    "6S",
    "5S",
    "4S",
    "3S",
    "2S",
  ],
  callerOpeningHcpThreshold: 12,
} satisfies Input;
export const exampleOutput = {
  highCardPoints: 10,
  suitCountsSpadesHeartsDiamondsClubs: [13, 0, 0, 0],
  meetsCallerOpeningHcpThreshold: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/bridge-high-card-points-hcp-count",
  title: "Bridge HCP High Card Points",
  description:
    "Audit a distinct 13-card bridge hand for HCP and actual suit shape under caller opening threshold; no distribution/losing-trick/bidding system inference or recommended bid.",
  inputs: inputFields,
  outputs: [
    { id: "highCardPoints", label: "High card points", kind: "number" },
    {
      id: "suitCountsSpadesHeartsDiamondsClubs",
      label: "Suit counts spades hearts diamonds clubs",
      kind: "numberList",
    },
    {
      id: "meetsCallerOpeningHcpThreshold",
      label: "Meets caller opening hcp threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      thirteenCardHand: value.thirteenCardHand as readonly string[],
      callerOpeningHcpThreshold: value.callerOpeningHcpThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
