import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, cards } from "../shared.js";
export type Input = Readonly<{
  readonly cardName: string;
  readonly trumpSuit: string;
  readonly ledSuit: string;
}>;
export type Output = Readonly<{
  readonly effectiveCardSuit: string;
  readonly trickPowerRank: number;
  readonly isLeftBower: boolean;
  readonly isRightBower: boolean;
}>;
const inputFields = [
  { id: "cardName", label: "Card name", kind: "string" },
  { id: "trumpSuit", label: "Trump suit", kind: "string" },
  { id: "ledSuit", label: "Led suit", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const c = cards([input.cardName], 1)[0];
  if (
    !["C", "D", "H", "S"].includes(input.trumpSuit) ||
    !["C", "D", "H", "S"].includes(input.ledSuit) ||
    c.rank < 9
  )
    simpleError(
      "card",
      "Standard 24-card euchre ranks 9–A and declared suits required.",
    );
  const color = (s: string) => ("HD".includes(s) ? "red" : "black"),
    right = c.rank === 11 && c.suit === input.trumpSuit,
    left =
      c.rank === 11 &&
      c.suit !== input.trumpSuit &&
      color(c.suit) === color(input.trumpSuit),
    effective = left ? input.trumpSuit : c.suit,
    rank = right
      ? 13
      : left
        ? 12
        : effective === input.trumpSuit
          ? [9, 10, 12, 13, 14].indexOf(c.rank) + 7
          : effective === input.ledSuit
            ? [9, 10, 11, 12, 13, 14].indexOf(c.rank) + 1
            : 0;
  return {
    effectiveCardSuit: effective,
    trickPowerRank: rank,
    isLeftBower: left,
    isRightBower: right,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cardName: "JD",
  trumpSuit: "H",
  ledSuit: "S",
} satisfies Input;
export const exampleOutput = {
  effectiveCardSuit: "H",
  trickPowerRank: 12,
  isLeftBower: true,
  isRightBower: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/euchre-trump-trick-power-rank-lookup",
  title: "Euchre Trump Trick Power Rank",
  description:
    "Resolve standard euchre left/right bower effective suit and comparative trick power under actual trump/led suit; off-suit nontrumps rank zero and follow-suit hand legality is not inferred.",
  inputs: inputFields,
  outputs: [
    { id: "effectiveCardSuit", label: "Effective card suit", kind: "string" },
    { id: "trickPowerRank", label: "Trick power rank", kind: "number" },
    { id: "isLeftBower", label: "Is left bower", kind: "boolean" },
    { id: "isRightBower", label: "Is right bower", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      cardName: value.cardName as string,
      trumpSuit: value.trumpSuit as string,
      ledSuit: value.ledSuit as string,
    }),
});
export const run = tool.execute;
export default tool;
