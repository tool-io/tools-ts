import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly claimsMadePolicyEndDate: string;
  readonly tailMonths: number;
  readonly claimReportedDate: string;
}>;
export type Output = Readonly<{
  readonly tailExpirationDate: string;
  readonly monthsFromPolicyEnd: number;
  readonly withinTail: boolean;
}>;

export const calculate = (input: Input): Output => {
  const end = new Date(`${input.claimsMadePolicyEndDate}T00:00:00Z`),
    reported = new Date(`${input.claimReportedDate}T00:00:00Z`);
  if (
    Number.isNaN(end.getTime()) ||
    Number.isNaN(reported.getTime()) ||
    reported < end
  )
    simpleError(
      "claimReportedDate",
      "Dates must be valid and ordered.",
      "invalid_dates",
    );
  const expiration = new Date(end);
  expiration.setUTCMonth(expiration.getUTCMonth() + input.tailMonths);
  let monthsFromPolicyEnd =
    (reported.getUTCFullYear() - end.getUTCFullYear()) * 12 +
    reported.getUTCMonth() -
    end.getUTCMonth();
  if (reported.getUTCDate() < end.getUTCDate()) monthsFromPolicyEnd -= 1;
  return {
    tailExpirationDate: expiration.toISOString().slice(0, 10),
    monthsFromPolicyEnd,
    withinTail: reported <= expiration,
  };
};

export const exampleInput = {
  claimsMadePolicyEndDate: "2025-01-01",
  tailMonths: 12,
  claimReportedDate: "2025-07-01",
} satisfies Input;
export const exampleOutput = {
  tailExpirationDate: "2026-01-01",
  monthsFromPolicyEnd: 6,
  withinTail: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      claimsMadePolicyEndDate: input.claimsMadePolicyEndDate as string,
      tailMonths: input.tailMonths as number,
      claimReportedDate: input.claimReportedDate as string,
    }),
  description:
    "Check a reported claim against a supplied claims-made tail period.",
  id: "insurance/tail-coverage-window",
  inputs: [
    {
      id: "claimsMadePolicyEndDate",
      label: "Claims-made policy end date",
      kind: "string",
    },
    {
      id: "tailMonths",
      label: "Tail coverage duration",
      kind: "integer",
      minimum: 0,
      unit: "months",
    },
    { id: "claimReportedDate", label: "Claim reported date", kind: "string" },
  ],
  outputs: [
    { id: "tailExpirationDate", label: "Tail expiration date", kind: "string" },
    {
      id: "monthsFromPolicyEnd",
      label: "Whole months from policy end",
      kind: "integer",
      minimum: 0,
    },
    { id: "withinTail", label: "Claim reported within tail", kind: "boolean" },
  ],
  title: "Tail Coverage Window",
});

export const run = tool.execute;
export default tool;
