import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly signedAssetBalancesMinor: readonly number[];
  readonly signedLiabilityBalancesMinor: readonly number[];
  readonly signedEquityBalancesMinor: readonly number[];
  readonly callerToleranceMinor: number;
}>;
export type Output = Readonly<{
  readonly netAssetsMinor: number;
  readonly netLiabilitiesMinor: number;
  readonly netEquityMinor: number;
  readonly signedAccountingEquationResidualMinor: number;
  readonly accountingEquationWithinTolerance: boolean;
}>;
const inputFields = [
  {
    id: "signedAssetBalancesMinor",
    label: "Signed asset balances minor",
    kind: "numberList",
  },
  {
    id: "signedLiabilityBalancesMinor",
    label: "Signed liability balances minor",
    kind: "numberList",
  },
  {
    id: "signedEquityBalancesMinor",
    label: "Signed equity balances minor",
    kind: "numberList",
  },
  {
    id: "callerToleranceMinor",
    label: "Caller tolerance minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerToleranceMinor, "callerToleranceMinor");
  input.signedAssetBalancesMinor.forEach((v) =>
    integer(v, "signedAssetBalancesMinor"),
  );
  input.signedLiabilityBalancesMinor.forEach((v) =>
    integer(v, "signedLiabilityBalancesMinor"),
  );
  input.signedEquityBalancesMinor.forEach((v) =>
    integer(v, "signedEquityBalancesMinor"),
  );
  const a = signedSum(input.signedAssetBalancesMinor),
    l = signedSum(input.signedLiabilityBalancesMinor),
    e = signedSum(input.signedEquityBalancesMinor),
    gap = signedSum([a, -l, -e]);
  return {
    netAssetsMinor: a,
    netLiabilitiesMinor: l,
    netEquityMinor: e,
    signedAccountingEquationResidualMinor: gap,
    accountingEquationWithinTolerance:
      Math.abs(gap) <= input.callerToleranceMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedAssetBalancesMinor: [1000, -100],
  signedLiabilityBalancesMinor: [400],
  signedEquityBalancesMinor: [500],
  callerToleranceMinor: 0,
} satisfies Input;
export const exampleOutput = {
  netAssetsMinor: 900,
  netLiabilitiesMinor: 400,
  netEquityMinor: 500,
  signedAccountingEquationResidualMinor: 0,
  accountingEquationWithinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/balance-sheet-equation-balancer",
  title: "Balance Sheet Equation Balancer A Equals L Plus E Tool",
  description:
    "Reconcile actual signed statement account sections A−L−E including contra balances and caller tolerance; equation agreement is not assurance that statements are complete or correctly valued.",
  inputs: inputFields,
  outputs: [
    { id: "netAssetsMinor", label: "Net assets minor", kind: "number" },
    {
      id: "netLiabilitiesMinor",
      label: "Net liabilities minor",
      kind: "number",
    },
    { id: "netEquityMinor", label: "Net equity minor", kind: "number" },
    {
      id: "signedAccountingEquationResidualMinor",
      label: "Signed accounting equation residual minor",
      kind: "number",
    },
    {
      id: "accountingEquationWithinTolerance",
      label: "Accounting equation within tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      signedAssetBalancesMinor:
        value.signedAssetBalancesMinor as readonly number[],
      signedLiabilityBalancesMinor:
        value.signedLiabilityBalancesMinor as readonly number[],
      signedEquityBalancesMinor:
        value.signedEquityBalancesMinor as readonly number[],
      callerToleranceMinor: value.callerToleranceMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
