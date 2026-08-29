import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RetainedEarningsRollforwardInput = {
  readonly beginningRetainedEarnings: number;
  readonly dividendsDeclared: number;
  readonly netIncome: number;
};

export type RetainedEarningsRollforwardOutput = {
  readonly endingRetainedEarnings: number;
};

export const retainedEarningsRollforwardExample = {
  input: {
    beginningRetainedEarnings: 100000,
    dividendsDeclared: 15000,
    netIncome: 50000,
  },
  output: { endingRetainedEarnings: 135000 },
} satisfies ToolExample<
  RetainedEarningsRollforwardInput,
  RetainedEarningsRollforwardOutput
>;

export const calculateRetainedEarningsRollforward = (
  input: RetainedEarningsRollforwardInput,
): RetainedEarningsRollforwardOutput => {
  for (const [field, value] of Object.entries(input)) {
    if (!Number.isFinite(value))
      simpleError(
        field,
        "The amount must be a finite number.",
        "invalid_amount",
      );
  }
  if (input.dividendsDeclared < 0)
    simpleError(
      "dividendsDeclared",
      "Dividends declared must not be negative; enter distributions as a positive amount.",
      "invalid_dividends",
    );
  const endingRetainedEarnings =
    input.beginningRetainedEarnings + input.netIncome - input.dividendsDeclared;
  if (!Number.isFinite(endingRetainedEarnings))
    simpleError(
      "netIncome",
      "The ending balance is outside the representable numeric range.",
      "result_not_finite",
    );
  return {
    endingRetainedEarnings:
      endingRetainedEarnings === 0 ? 0 : endingRetainedEarnings,
  };
};

export const retainedEarningsRollforwardTool = createSimpleTool({
  calculate: (input) =>
    calculateRetainedEarningsRollforward({
      beginningRetainedEarnings: input.beginningRetainedEarnings as number,
      dividendsDeclared: input.dividendsDeclared as number,
      netIncome: input.netIncome as number,
    }),
  description:
    "Roll retained earnings forward for a period: beginning balance plus net income (or minus a net loss) minus dividends declared.",
  id: "accounting/retained-earnings-rollforward-statement",
  inputs: [
    {
      description:
        "Retained earnings balance at the start of the period; a deficit is entered as a negative amount.",
      id: "beginningRetainedEarnings",
      kind: "number",
      label: "Beginning retained earnings",
    },
    {
      description:
        "Net income for the period; enter a net loss as a negative amount.",
      id: "netIncome",
      kind: "number",
      label: "Net income",
    },
    {
      description:
        "Total dividends declared during the period, including cash and stock dividends.",
      id: "dividendsDeclared",
      kind: "number",
      label: "Dividends declared",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Retained earnings balance at period end after net income and dividends.",
      id: "endingRetainedEarnings",
      kind: "number",
      label: "Ending retained earnings",
    },
  ],
  title: "Retained Earnings Rollforward Calculator",
});
export const runRetainedEarningsRollforward =
  retainedEarningsRollforwardTool.execute;
export default retainedEarningsRollforwardTool;
