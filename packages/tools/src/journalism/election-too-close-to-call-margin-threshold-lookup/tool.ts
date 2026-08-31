import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  sumMoney,
  nonnegative,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly firstCandidateReportedVotes: number;
  readonly secondCandidateReportedVotes: number;
  readonly callerMaximumOutstandingVotes: number;
  readonly callerExtraUncertaintyVotes: number;
}>;
export type Output = Readonly<{
  readonly signedReportedFirstMinusSecondVotes: number;
  readonly worstCaseFirstMarginIntervalVotes: readonly number[];
  readonly leaderCouldChangeUnderCallerBounds: boolean;
}>;
const inputFields = [
  {
    id: "firstCandidateReportedVotes",
    label: "First candidate reported votes",
    kind: "number",
  },
  {
    id: "secondCandidateReportedVotes",
    label: "Second candidate reported votes",
    kind: "number",
  },
  {
    id: "callerMaximumOutstandingVotes",
    label: "Caller maximum outstanding votes",
    kind: "number",
  },
  {
    id: "callerExtraUncertaintyVotes",
    label: "Caller extra uncertainty votes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.firstCandidateReportedVotes, "firstCandidateReportedVotes");
  nonnegative(
    input.secondCandidateReportedVotes,
    "secondCandidateReportedVotes",
  );
  nonnegative(
    input.callerMaximumOutstandingVotes,
    "callerMaximumOutstandingVotes",
  );
  nonnegative(input.callerExtraUncertaintyVotes, "callerExtraUncertaintyVotes");
  integer(input.firstCandidateReportedVotes, "firstCandidateReportedVotes");
  integer(input.secondCandidateReportedVotes, "secondCandidateReportedVotes");
  integer(input.callerMaximumOutstandingVotes, "callerMaximumOutstandingVotes");
  integer(input.callerExtraUncertaintyVotes, "callerExtraUncertaintyVotes");
  const margin = integer(
      input.firstCandidateReportedVotes - input.secondCandidateReportedVotes,
      "margin",
    ),
    uncertainty = sumMoney([
      input.callerMaximumOutstandingVotes,
      input.callerExtraUncertaintyVotes,
    ]),
    lo = integer(margin - uncertainty, "lowerMargin"),
    hi = integer(margin + uncertainty, "upperMargin");
  return {
    signedReportedFirstMinusSecondVotes: margin,
    worstCaseFirstMarginIntervalVotes: [lo, hi],
    leaderCouldChangeUnderCallerBounds: lo <= 0 && hi >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstCandidateReportedVotes: 100,
  secondCandidateReportedVotes: 90,
  callerMaximumOutstandingVotes: 20,
  callerExtraUncertaintyVotes: 0,
} satisfies Input;
export const exampleOutput = {
  signedReportedFirstMinusSecondVotes: 10,
  worstCaseFirstMarginIntervalVotes: [-10, 30],
  leaderCouldChangeUnderCallerBounds: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/election-too-close-to-call-margin-threshold-lookup",
  title: "Election Too Close to Call Margin Threshold Lookup",
  description:
    "Audit actual two-candidate reported margin under explicit outstanding/error vote bounds using adversarial worst-case allocation; no predicted uncounted vote mix, official race call, certification or statistical confidence.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedReportedFirstMinusSecondVotes",
      label: "Signed reported first minus second votes",
      kind: "number",
    },
    {
      id: "worstCaseFirstMarginIntervalVotes",
      label: "Worst case first margin interval votes",
      kind: "numberList",
    },
    {
      id: "leaderCouldChangeUnderCallerBounds",
      label: "Leader could change under caller bounds",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      firstCandidateReportedVotes: value.firstCandidateReportedVotes as number,
      secondCandidateReportedVotes:
        value.secondCandidateReportedVotes as number,
      callerMaximumOutstandingVotes:
        value.callerMaximumOutstandingVotes as number,
      callerExtraUncertaintyVotes: value.callerExtraUncertaintyVotes as number,
    }),
});
export const run = tool.execute;
export default tool;
