import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  aligned,
  allocateMinor,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly openingPartnerCapitalMinor: readonly number[];
  readonly partnerContributionsMinor: readonly number[];
  readonly partnerDrawingsMinor: readonly number[];
  readonly partnershipProfitOrLossMinor: number;
  readonly callerProfitSharingWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly partnerProfitAllocationsMinor: readonly number[];
  readonly closingPartnerCapitalMinor: readonly number[];
  readonly partnerCapitalDeficitFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "openingPartnerCapitalMinor",
    label: "Opening partner capital minor",
    kind: "numberList",
  },
  {
    id: "partnerContributionsMinor",
    label: "Partner contributions minor",
    kind: "numberList",
  },
  {
    id: "partnerDrawingsMinor",
    label: "Partner drawings minor",
    kind: "numberList",
  },
  {
    id: "partnershipProfitOrLossMinor",
    label: "Partnership profit or loss minor",
    kind: "number",
  },
  {
    id: "callerProfitSharingWeights",
    label: "Caller profit sharing weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.partnerContributionsMinor.forEach((v) =>
    money(v, "partnerContributionsMinor"),
  );
  input.partnerDrawingsMinor.forEach((v) => money(v, "partnerDrawingsMinor"));
  input.openingPartnerCapitalMinor.forEach((v) =>
    integer(v, "openingPartnerCapitalMinor"),
  );
  integer(input.partnershipProfitOrLossMinor, "partnershipProfitOrLossMinor");
  aligned(
    input.openingPartnerCapitalMinor,
    input.partnerContributionsMinor,
    "openingPartnerCapitalMinor",
  );
  aligned(
    input.openingPartnerCapitalMinor,
    input.partnerDrawingsMinor,
    "openingPartnerCapitalMinor",
  );
  aligned(
    input.openingPartnerCapitalMinor,
    input.callerProfitSharingWeights,
    "openingPartnerCapitalMinor",
  );
  const shares = allocateMinor(
      Math.abs(input.partnershipProfitOrLossMinor),
      input.callerProfitSharingWeights,
    ).map((v) => (input.partnershipProfitOrLossMinor < 0 ? -v : v)),
    capital = input.openingPartnerCapitalMinor.map((v, i) =>
      signedSum([
        v,
        input.partnerContributionsMinor[i],
        -input.partnerDrawingsMinor[i],
        shares[i],
      ]),
    );
  return {
    partnerProfitAllocationsMinor: shares,
    closingPartnerCapitalMinor: capital,
    partnerCapitalDeficitFlags: capital.map((v) => (v < 0 ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingPartnerCapitalMinor: [100, 200],
  partnerContributionsMinor: [10, 0],
  partnerDrawingsMinor: [0, 300],
  partnershipProfitOrLossMinor: 100,
  callerProfitSharingWeights: [2, 3],
} satisfies Input;
export const exampleOutput = {
  partnerProfitAllocationsMinor: [40, 60],
  closingPartnerCapitalMinor: [150, -40],
  partnerCapitalDeficitFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/partnership-capital-account-rollforward",
  title: "Partnership Capital Account Rollforward Calculator",
  description:
    "Roll forward actual partner capital/contributions/draws and signed profit/loss under explicit integer sharing weights, with exact remainder allocation and deficits retained; no tax basis, guaranteed payments or liquidation priority inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "partnerProfitAllocationsMinor",
      label: "Partner profit allocations minor",
      kind: "numberList",
    },
    {
      id: "closingPartnerCapitalMinor",
      label: "Closing partner capital minor",
      kind: "numberList",
    },
    {
      id: "partnerCapitalDeficitFlags",
      label: "Partner capital deficit flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      openingPartnerCapitalMinor:
        value.openingPartnerCapitalMinor as readonly number[],
      partnerContributionsMinor:
        value.partnerContributionsMinor as readonly number[],
      partnerDrawingsMinor: value.partnerDrawingsMinor as readonly number[],
      partnershipProfitOrLossMinor:
        value.partnershipProfitOrLossMinor as number,
      callerProfitSharingWeights:
        value.callerProfitSharingWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
