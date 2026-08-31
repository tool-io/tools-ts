import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly pitchOutcomeAcceptedRejectedPendingWithdrawnCodes: readonly number[];
}>;
export type Output = Readonly<{
  readonly acceptedPitchCount: number;
  readonly rejectedPitchCount: number;
  readonly pendingPitchCount: number;
  readonly withdrawnPitchCount: number;
  readonly acceptancePercentAmongDecidedPitches: number;
  readonly decidedPitchEvidenceAvailable: boolean;
}>;
const inputFields = [
  {
    id: "pitchOutcomeAcceptedRejectedPendingWithdrawnCodes",
    label: "Pitch outcome accepted rejected pending withdrawn codes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.pitchOutcomeAcceptedRejectedPendingWithdrawnCodes.forEach((v) =>
    bounded(v, "outcome", 0, 3),
  );
  if (!input.pitchOutcomeAcceptedRejectedPendingWithdrawnCodes.length)
    simpleError("pitches", "Observed pitch records required.");
  const counts = [0, 1, 2, 3].map(
      (c) =>
        input.pitchOutcomeAcceptedRejectedPendingWithdrawnCodes.filter(
          (v) => v === c,
        ).length,
    ),
    decided = counts[0] + counts[1];
  return {
    acceptedPitchCount: counts[0],
    rejectedPitchCount: counts[1],
    pendingPitchCount: counts[2],
    withdrawnPitchCount: counts[3],
    acceptancePercentAmongDecidedPitches: decided
      ? (100 * counts[0]) / decided
      : -1,
    decidedPitchEvidenceAvailable: decided > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pitchOutcomeAcceptedRejectedPendingWithdrawnCodes: [0, 1, 2, 0, 3],
} satisfies Input;
export const exampleOutput = {
  acceptedPitchCount: 2,
  rejectedPitchCount: 1,
  pendingPitchCount: 1,
  withdrawnPitchCount: 1,
  acceptancePercentAmongDecidedPitches: 66.66666666666667,
  decidedPitchEvidenceAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/pitch-accept-rate-percent-freelance-calculator",
  title: "Pitch Accept Rate Percent Freelance Calculator",
  description:
    "Audit observed freelance pitch outcomes with pending/withdrawn separate and conditional decided denominator; no future accept probability or silent treatment of unanswered pitches as rejections.",
  inputs: inputFields,
  outputs: [
    { id: "acceptedPitchCount", label: "Accepted pitch count", kind: "number" },
    { id: "rejectedPitchCount", label: "Rejected pitch count", kind: "number" },
    { id: "pendingPitchCount", label: "Pending pitch count", kind: "number" },
    {
      id: "withdrawnPitchCount",
      label: "Withdrawn pitch count",
      kind: "number",
    },
    {
      id: "acceptancePercentAmongDecidedPitches",
      label: "Acceptance percent among decided pitches",
      kind: "number",
    },
    {
      id: "decidedPitchEvidenceAvailable",
      label: "Decided pitch evidence available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      pitchOutcomeAcceptedRejectedPendingWithdrawnCodes:
        value.pitchOutcomeAcceptedRejectedPendingWithdrawnCodes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
