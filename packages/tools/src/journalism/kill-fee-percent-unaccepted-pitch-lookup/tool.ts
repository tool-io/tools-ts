import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  money,
  weightedMinor,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly contractedStoryFeeMinor: number;
  readonly callerKillFeeBasisPoints: number;
  readonly alreadyPaidAdvanceMinor: number;
  readonly callerKillFeeTriggerSatisfied: boolean;
}>;
export type Output = Readonly<{
  readonly callerGrossKillFeeMinor: number;
  readonly signedKillFeeLessAdvanceMinor: number;
}>;
const inputFields = [
  {
    id: "contractedStoryFeeMinor",
    label: "Contracted story fee minor",
    kind: "number",
  },
  {
    id: "callerKillFeeBasisPoints",
    label: "Caller kill fee basis points",
    kind: "number",
  },
  {
    id: "alreadyPaidAdvanceMinor",
    label: "Already paid advance minor",
    kind: "number",
  },
  {
    id: "callerKillFeeTriggerSatisfied",
    label: "Caller kill fee trigger satisfied",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.contractedStoryFeeMinor, "fee");
  money(input.alreadyPaidAdvanceMinor, "advance");
  bounded(input.callerKillFeeBasisPoints, "rate", 0, 10000);
  const fee = input.callerKillFeeTriggerSatisfied
    ? weightedMinor(
        input.contractedStoryFeeMinor,
        input.callerKillFeeBasisPoints,
        10000,
      )
    : 0;
  return {
    callerGrossKillFeeMinor: fee,
    signedKillFeeLessAdvanceMinor: integer(
      fee - input.alreadyPaidAdvanceMinor,
      "net",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  contractedStoryFeeMinor: 1000,
  callerKillFeeBasisPoints: 2500,
  alreadyPaidAdvanceMinor: 100,
  callerKillFeeTriggerSatisfied: true,
} satisfies Input;
export const exampleOutput = {
  callerGrossKillFeeMinor: 250,
  signedKillFeeLessAdvanceMinor: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/kill-fee-percent-unaccepted-pitch-lookup",
  title: "Kill Fee Percent Unaccepted Pitch Lookup",
  description:
    "Reconcile actual commissioned-story cancellation fee against explicit caller contract trigger/rate and paid advance, retaining possible credit/refund; not assumed entitlement for an unaccepted pitch, legal contract interpretation or universal kill fee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerGrossKillFeeMinor",
      label: "Caller gross kill fee minor",
      kind: "number",
    },
    {
      id: "signedKillFeeLessAdvanceMinor",
      label: "Signed kill fee less advance minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      contractedStoryFeeMinor: value.contractedStoryFeeMinor as number,
      callerKillFeeBasisPoints: value.callerKillFeeBasisPoints as number,
      alreadyPaidAdvanceMinor: value.alreadyPaidAdvanceMinor as number,
      callerKillFeeTriggerSatisfied:
        value.callerKillFeeTriggerSatisfied as boolean,
    }),
});
export const run = tool.execute;
export default tool;
