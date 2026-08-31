import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly potBeforeOpponentBet: number;
  readonly opponentBet: number;
  readonly amountToCall: number;
}>;
export type Output = Readonly<{
  readonly potImmediatelyBeforeCall: number;
  readonly finalPotAfterCall: number;
  readonly breakEvenEquityPercent: number;
}>;
const inputFields = [
  {
    id: "potBeforeOpponentBet",
    label: "Pot before opponent bet",
    kind: "number",
  },
  { id: "opponentBet", label: "Opponent bet", kind: "number" },
  { id: "amountToCall", label: "Amount to call", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.amountToCall, "amountToCall");
  nonnegative(input.potBeforeOpponentBet, "potBeforeOpponentBet");
  nonnegative(input.opponentBet, "opponentBet");
  const pot = input.potBeforeOpponentBet + input.opponentBet,
    total = pot + input.amountToCall;
  return {
    potImmediatelyBeforeCall: pot,
    finalPotAfterCall: total,
    breakEvenEquityPercent: (100 * input.amountToCall) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  potBeforeOpponentBet: 100,
  opponentBet: 50,
  amountToCall: 50,
} satisfies Input;
export const exampleOutput = {
  potImmediatelyBeforeCall: 150,
  finalPotAfterCall: 200,
  breakEvenEquityPercent: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/poker-pot-odds-percent",
  title: "Pot Odds Percent Calculator",
  description:
    "Resolve call equity threshold from separate pre-bet pot/opponent bet/call to avoid ambiguous pot denominator; no future bets, rake, side pots or implied odds.",
  inputs: inputFields,
  outputs: [
    {
      id: "potImmediatelyBeforeCall",
      label: "Pot immediately before call",
      kind: "number",
    },
    { id: "finalPotAfterCall", label: "Final pot after call", kind: "number" },
    {
      id: "breakEvenEquityPercent",
      label: "Break even equity percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      potBeforeOpponentBet: value.potBeforeOpponentBet as number,
      opponentBet: value.opponentBet as number,
      amountToCall: value.amountToCall as number,
    }),
});
export const run = tool.execute;
export default tool;
