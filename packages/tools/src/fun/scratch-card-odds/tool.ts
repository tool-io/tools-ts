import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualRemainingWinningTickets: number;
  readonly actualRemainingTicketCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRemainingWinningTickets",
    label: "Actual remaining winning tickets",
    kind: "number",
  },
  {
    id: "actualRemainingTicketCount",
    label: "Actual remaining ticket count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualRemainingWinningTickets,
    "actualRemainingWinningTickets",
    0,
    1000000,
  );
  bounded(
    input.actualRemainingTicketCount,
    "actualRemainingTicketCount",
    1,
    1000000,
  );
  if (input.actualRemainingWinningTickets > input.actualRemainingTicketCount)
    simpleError("tickets", "Wins≤remaining.");
  return {
    value:
      input.actualRemainingWinningTickets / input.actualRemainingTicketCount,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualRemainingWinningTickets: 2, actualRemainingTicketCount: 4 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/scratch-card-odds",
  title: "Scratch Card Odds Calculator",
  description:
    "Actualverified remainingprizeticket oddsoneuniformremainingticket,sold/unsoldbasis independentlymatched,no advertisedinitialoddsorempty-denominatorforecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
