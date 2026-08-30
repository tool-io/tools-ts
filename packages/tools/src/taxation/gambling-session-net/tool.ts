import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sessionWinnings: number;
  readonly sessionLosses: number;
}>;
export type Output = Readonly<{
  readonly netSessionResult: number;
  readonly grossReportableWinnings: number;
  readonly lossesLimitedToWinnings: number;
}>;

export const calculate = (input: Input): Output => {
  return {
    netSessionResult: input.sessionWinnings - input.sessionLosses,
    grossReportableWinnings: input.sessionWinnings,
    lossesLimitedToWinnings: Math.min(
      input.sessionLosses,
      input.sessionWinnings,
    ),
  };
};

export const exampleInput = {
  sessionWinnings: 100,
  sessionLosses: 60,
} satisfies Input;
export const exampleOutput = {
  netSessionResult: 40,
  grossReportableWinnings: 100,
  lossesLimitedToWinnings: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sessionWinnings: input.sessionWinnings as number,
      sessionLosses: input.sessionLosses as number,
    }),
  description:
    "Summarize gambling-session net result, gross winnings, and losses limited to winnings.",
  id: "taxation/gambling-session-net",
  inputs: [
    {
      id: "sessionWinnings",
      label: "Session winnings",
      kind: "number",
      minimum: 0,
    },
    {
      id: "sessionLosses",
      label: "Session losses",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "netSessionResult", label: "Net session result", kind: "number" },
    {
      id: "grossReportableWinnings",
      label: "Gross winnings",
      kind: "number",
      minimum: 0,
    },
    {
      id: "lossesLimitedToWinnings",
      label: "Losses limited to winnings",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Gambling Session Net",
});

export const run = tool.execute;
export default tool;
