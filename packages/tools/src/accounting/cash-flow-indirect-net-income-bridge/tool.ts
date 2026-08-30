import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  aligned,
  binary,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly netIncomeMinor: number;
  readonly signedNoncashAddbacksMinor: readonly number[];
  readonly openingWorkingCapitalBalancesMinor: readonly number[];
  readonly closingWorkingCapitalBalancesMinor: readonly number[];
  readonly workingCapitalAssetOrLiabilityCodes: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalNoncashAdjustmentsMinor: number;
  readonly signedWorkingCapitalCashEffectsMinor: readonly number[];
  readonly modeledOperatingCashFlowMinor: number;
}>;
const inputFields = [
  { id: "netIncomeMinor", label: "Net income minor", kind: "number" },
  {
    id: "signedNoncashAddbacksMinor",
    label: "Signed noncash addbacks minor",
    kind: "numberList",
  },
  {
    id: "openingWorkingCapitalBalancesMinor",
    label: "Opening working capital balances minor",
    kind: "numberList",
  },
  {
    id: "closingWorkingCapitalBalancesMinor",
    label: "Closing working capital balances minor",
    kind: "numberList",
  },
  {
    id: "workingCapitalAssetOrLiabilityCodes",
    label: "Working capital asset or liability codes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.openingWorkingCapitalBalancesMinor.forEach((v) =>
    money(v, "openingWorkingCapitalBalancesMinor"),
  );
  input.closingWorkingCapitalBalancesMinor.forEach((v) =>
    money(v, "closingWorkingCapitalBalancesMinor"),
  );
  integer(input.netIncomeMinor, "netIncomeMinor");
  input.signedNoncashAddbacksMinor.forEach((v) =>
    integer(v, "signedNoncashAddbacksMinor"),
  );
  aligned(
    input.openingWorkingCapitalBalancesMinor,
    input.closingWorkingCapitalBalancesMinor,
    "openingWorkingCapitalBalancesMinor",
  );
  aligned(
    input.openingWorkingCapitalBalancesMinor,
    input.workingCapitalAssetOrLiabilityCodes,
    "openingWorkingCapitalBalancesMinor",
  );
  binary(input.workingCapitalAssetOrLiabilityCodes, "workingCapitalClass");
  const effects = input.openingWorkingCapitalBalancesMinor.map(
      (v, i) =>
        (input.closingWorkingCapitalBalancesMinor[i] - v) *
        (input.workingCapitalAssetOrLiabilityCodes[i] ? 1 : -1),
    ),
    noncash = signedSum(input.signedNoncashAddbacksMinor);
  return {
    totalNoncashAdjustmentsMinor: noncash,
    signedWorkingCapitalCashEffectsMinor: effects,
    modeledOperatingCashFlowMinor: signedSum([
      input.netIncomeMinor,
      noncash,
      ...effects,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  netIncomeMinor: 500,
  signedNoncashAddbacksMinor: [100, -20],
  openingWorkingCapitalBalancesMinor: [200, 100],
  closingWorkingCapitalBalancesMinor: [250, 130],
  workingCapitalAssetOrLiabilityCodes: [0, 1],
} satisfies Input;
export const exampleOutput = {
  totalNoncashAdjustmentsMinor: 80,
  signedWorkingCapitalCashEffectsMinor: [-50, 30],
  modeledOperatingCashFlowMinor: 560,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/cash-flow-indirect-net-income-bridge",
  title: "Cash Flow Indirect Net Income Bridge Calculator",
  description:
    "Build indirect operating cash bridge with signed noncash addbacks and asset-increase subtract/liability-increase add working-capital movements; caller excludes investing/financing acquisitions and other noncash balance changes.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalNoncashAdjustmentsMinor",
      label: "Total noncash adjustments minor",
      kind: "number",
    },
    {
      id: "signedWorkingCapitalCashEffectsMinor",
      label: "Signed working capital cash effects minor",
      kind: "numberList",
    },
    {
      id: "modeledOperatingCashFlowMinor",
      label: "Modeled operating cash flow minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      netIncomeMinor: value.netIncomeMinor as number,
      signedNoncashAddbacksMinor:
        value.signedNoncashAddbacksMinor as readonly number[],
      openingWorkingCapitalBalancesMinor:
        value.openingWorkingCapitalBalancesMinor as readonly number[],
      closingWorkingCapitalBalancesMinor:
        value.closingWorkingCapitalBalancesMinor as readonly number[],
      workingCapitalAssetOrLiabilityCodes:
        value.workingCapitalAssetOrLiabilityCodes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
