import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TerminalValueInput = Readonly<{
  readonly nextYearNoi: number;
  readonly exitCapRatePercent: number;
}>;
export type TerminalValueOutput = Readonly<{
  readonly terminalValue: number;
}>;

export const calculateTerminalValue = (
  x: TerminalValueInput,
): TerminalValueOutput => {
  if (!Number.isFinite(x.nextYearNoi) || x.nextYearNoi <= 0)
    simpleError("nextYearNoi", "Provide a finite positive number.");
  if (!Number.isFinite(x.exitCapRatePercent) || x.exitCapRatePercent <= 0)
    simpleError("exitCapRatePercent", "Provide a finite positive number.");
  const terminalValue = (100 * x.nextYearNoi) / x.exitCapRatePercent;
  if (!Number.isFinite(terminalValue))
    simpleError(
      "terminalValue",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { terminalValue: Object.is(terminalValue, -0) ? 0 : terminalValue };
};

export const example = {
  input: {
    nextYearNoi: 50000,
    exitCapRatePercent: 5,
  },
  output: { terminalValue: 1000000 },
} satisfies ToolExample<TerminalValueInput, TerminalValueOutput>;

export const tool = createSimpleTool({
  id: "real-estate/terminal-value",
  title: "Terminal Value",
  description:
    "Indicative exit value from next-year NOI and a user-supplied exit cap rate, before transaction costs.",
  inputs: [
    {
      id: "nextYearNoi",
      kind: "number",
      label: "Next Year Noi",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "exitCapRatePercent",
      kind: "number",
      label: "Exit Cap Rate Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "terminalValue",
      kind: "number",
      label: "Terminal Value",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateTerminalValue({
      nextYearNoi: input.nextYearNoi as number,
      exitCapRatePercent: input.exitCapRatePercent as number,
    }),
});
export const terminalValueTool = tool;
export const runTerminalValue = tool.execute;
export default tool;
