import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  aligned,
  binary,
  unique,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly claimIds: readonly string[];
  readonly observedIncurredReserveMinor: readonly number[];
  readonly observedPaidLossMinor: readonly number[];
  readonly observedOutstandingReserveMinor: readonly number[];
  readonly reserveEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedClaimReserveClosureMinor: readonly number[];
  readonly totalKnownReserveClosureMinor: number;
  readonly claimsWithoutReserveEvidence: readonly string[];
}>;
const inputFields = [
  { id: "claimIds", label: "Claim ids", kind: "stringList" },
  {
    id: "observedIncurredReserveMinor",
    label: "Observed incurred reserve minor",
    kind: "numberList",
  },
  {
    id: "observedPaidLossMinor",
    label: "Observed paid loss minor",
    kind: "numberList",
  },
  {
    id: "observedOutstandingReserveMinor",
    label: "Observed outstanding reserve minor",
    kind: "numberList",
  },
  {
    id: "reserveEvidenceFlags",
    label: "Reserve evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.claimIds, "claims");
  for (const values of [
    input.observedIncurredReserveMinor,
    input.observedPaidLossMinor,
    input.observedOutstandingReserveMinor,
    input.reserveEvidenceFlags,
  ])
    aligned(input.claimIds, values, "claims");
  binary(input.reserveEvidenceFlags, "evidence");
  [
    ...input.observedIncurredReserveMinor,
    ...input.observedPaidLossMinor,
    ...input.observedOutstandingReserveMinor,
  ].forEach((v) => money(v));
  const deltas = input.claimIds.map((_, i) =>
    input.reserveEvidenceFlags[i]
      ? input.observedIncurredReserveMinor[i] -
        input.observedPaidLossMinor[i] -
        input.observedOutstandingReserveMinor[i]
      : 0,
  );
  return {
    signedClaimReserveClosureMinor: deltas,
    totalKnownReserveClosureMinor: integer(
      Number(deltas.reduce((s, v) => s + BigInt(v), 0n)),
      "totalClosure",
    ),
    claimsWithoutReserveEvidence: input.claimIds.filter(
      (_, i) => !input.reserveEvidenceFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  claimIds: ["a", "b"],
  observedIncurredReserveMinor: [10000, 20000],
  observedPaidLossMinor: [3000, 5000],
  observedOutstandingReserveMinor: [7000, 14000],
  reserveEvidenceFlags: [1, 1],
} satisfies Input;
export const exampleOutput = {
  signedClaimReserveClosureMinor: [0, 1000],
  totalKnownReserveClosureMinor: 1000,
  claimsWithoutReserveEvidence: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/reserve-paid-outstanding-reconciliation",
  title: "Reserve Paid Outstanding Reconciliation Tool",
  description:
    "Reconcile actual claim-by-claim incurred=paid+outstanding monetary ledger, signed deltas and explicit unknown IDs; no IBNR estimation, reserve adequacy or insurer statutory accounting rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedClaimReserveClosureMinor",
      label: "Signed claim reserve closure minor",
      kind: "numberList",
    },
    {
      id: "totalKnownReserveClosureMinor",
      label: "Total known reserve closure minor",
      kind: "number",
    },
    {
      id: "claimsWithoutReserveEvidence",
      label: "Claims without reserve evidence",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      claimIds: value.claimIds as readonly string[],
      observedIncurredReserveMinor:
        value.observedIncurredReserveMinor as readonly number[],
      observedPaidLossMinor: value.observedPaidLossMinor as readonly number[],
      observedOutstandingReserveMinor:
        value.observedOutstandingReserveMinor as readonly number[],
      reserveEvidenceFlags: value.reserveEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
