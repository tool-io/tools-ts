import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
  money,
  signedSum,
  sumMoney,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly participantIds: readonly string[];
  readonly contributionPerParticipantPerRoundMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "participantIds", label: "Participant ids", kind: "stringList" },
  {
    id: "contributionPerParticipantPerRoundMinor",
    label: "Contribution per participant per round minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.participantIds, "participants");
  if (input.participantIds.length > 64)
    simpleError("participants", "At most64explicit participants.");
  money(input.contributionPerParticipantPerRoundMinor, "contribution");
  const n = input.participantIds.length,
    c = input.contributionPerParticipantPerRoundMinor,
    p = sumMoney(Array(n).fill(c));
  return {
    potPerRoundMinor: p,
    roundCount: n,
    totalPerParticipantContributionMinor: p,
    payoutByRoundMinor: Array(n).fill(p),
    netCashFlowsByParticipantMinor: input.participantIds.map((_, i) =>
      input.participantIds.map((_, r) => (r === i ? signedSum([p, -c]) : -c)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    participantIds: ["a", "b", "c"],
    contributionPerParticipantPerRoundMinor: 100,
  },
  output: {
    result: {
      potPerRoundMinor: 300,
      roundCount: 3,
      totalPerParticipantContributionMinor: 300,
      payoutByRoundMinor: [300, 300, 300],
      netCashFlowsByParticipantMinor: [
        [200, -100, -100],
        [-100, 200, -100],
        [-100, -100, 200],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/rosca-rotating-savings-association-cycle-mathematics",
  title: "Rosca Rotating Savings Association Cycle Mathematics",
  description:
    "Ideal one-cycle ROSCA schedule with one equal contribution per participant each round and payout order given by distinct IDs. Exact safe-integer minor units in one currency; no defaults, fees, interest, time value, legal enforceability or guaranteed returns.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
