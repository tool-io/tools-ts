import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualDistributableCashMinorUnits: number;
  readonly callerContractEstablishedSequentialTierClaimsMinorUnits: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDistributableCashMinorUnits",
    label: "Actual distributable cash minor units",
    kind: "number",
  },
  {
    id: "callerContractEstablishedSequentialTierClaimsMinorUnits",
    label: "Caller contract established sequential tier claims minor units",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.actualDistributableCashMinorUnits, "cash");
  let cash = input.actualDistributableCashMinorUnits;
  const paid =
    input.callerContractEstablishedSequentialTierClaimsMinorUnits.map((v) => {
      money(v, "tierclaim");
      const p = Math.min(cash, v);
      cash -= p;
      return p;
    });
  return {
    actualPaidPerTierMinorUnits: paid,
    unpaidTierClaimMinorUnits: paid.map(
      (v, i) =>
        input.callerContractEstablishedSequentialTierClaimsMinorUnits[i] - v,
    ),
    unallocatedResidualMinorUnits: cash,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDistributableCashMinorUnits: 100,
    callerContractEstablishedSequentialTierClaimsMinorUnits: [60, 70],
  },
  output: {
    result: {
      actualPaidPerTierMinorUnits: [60, 40],
      unpaidTierClaimMinorUnits: [0, 30],
      unallocatedResidualMinorUnits: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/waterfall-distribution",
  title: "Waterfall Distribution Calculator",
  description:
    "Actual contract-established fixed ordered cash claims waterfall ledger, independently verified priority/entitlements. No infer IRR hurdle, preferred return/catchup/promote or legal deal terms. Exact minor units, unpaidclaims/residual explicit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
