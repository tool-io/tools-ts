import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  aligned,
  binary,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedStockAmountsMinor: readonly number[];
  readonly callerOwnedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly ownedInventoryIncludedMinor: number;
  readonly unownedConsignedStockExcludedMinor: number;
  readonly excludedObservedLineIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedStockAmountsMinor",
    label: "Observed stock amounts minor",
    kind: "numberList",
  },
  { id: "callerOwnedFlags", label: "Caller owned flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStockAmountsMinor.forEach((v) =>
    money(v, "observedStockAmountsMinor"),
  );
  binary(input.callerOwnedFlags, "callerOwnedFlags");
  aligned(
    input.observedStockAmountsMinor,
    input.callerOwnedFlags,
    "observedStockAmountsMinor",
  );
  return {
    ownedInventoryIncludedMinor: sumMoney(
      input.observedStockAmountsMinor.filter(
        (_, i) => input.callerOwnedFlags[i] === 1,
      ),
    ),
    unownedConsignedStockExcludedMinor: sumMoney(
      input.observedStockAmountsMinor.filter(
        (_, i) => input.callerOwnedFlags[i] === 0,
      ),
    ),
    excludedObservedLineIndices: input.callerOwnedFlags.flatMap((v, i) =>
      v === 0 ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStockAmountsMinor: [100, 200, 300],
  callerOwnedFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  ownedInventoryIncludedMinor: 400,
  unownedConsignedStockExcludedMinor: 200,
  excludedObservedLineIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/consignment-goods-not-owned-exclude-checker",
  title: "Consignment Goods Not Owned Exclude Checker",
  description:
    "Reconcile actual on-site stock values with explicit caller ownership evidence, retaining excluded consignment lines; physical possession alone does not establish ownership or which off-site owned stock is missing.",
  inputs: inputFields,
  outputs: [
    {
      id: "ownedInventoryIncludedMinor",
      label: "Owned inventory included minor",
      kind: "number",
    },
    {
      id: "unownedConsignedStockExcludedMinor",
      label: "Unowned consigned stock excluded minor",
      kind: "number",
    },
    {
      id: "excludedObservedLineIndices",
      label: "Excluded observed line indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStockAmountsMinor:
        value.observedStockAmountsMinor as readonly number[],
      callerOwnedFlags: value.callerOwnedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
