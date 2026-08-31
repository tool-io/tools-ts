import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  catalogIndex,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerTraySkuIds: readonly string[];
  readonly callerRows: readonly number[];
  readonly callerColumns: readonly number[];
  readonly callerMissingCellCounts: readonly number[];
  readonly queryTraySkuId: string;
}>;
export type Output = Readonly<{
  readonly callerNominalTrayCellCount: number;
  readonly callerUsableTrayCellCount: number;
}>;
const inputFields = [
  { id: "callerTraySkuIds", label: "Caller tray sku ids", kind: "stringList" },
  { id: "callerRows", label: "Caller rows", kind: "numberList" },
  { id: "callerColumns", label: "Caller columns", kind: "numberList" },
  {
    id: "callerMissingCellCounts",
    label: "Caller missing cell counts",
    kind: "numberList",
  },
  { id: "queryTraySkuId", label: "Query tray sku id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.callerTraySkuIds, input.callerRows, "catalog");
  aligned(input.callerTraySkuIds, input.callerColumns, "catalog");
  aligned(input.callerTraySkuIds, input.callerMissingCellCounts, "catalog");
  input.callerRows.forEach((v) => bounded(v, "rows", 1, 1000));
  input.callerColumns.forEach((v) => bounded(v, "columns", 1, 1000));
  input.callerMissingCellCounts.forEach((v, i) =>
    bounded(v, "missing", 0, input.callerRows[i] * input.callerColumns[i]),
  );
  const i = catalogIndex(input.callerTraySkuIds, input.queryTraySkuId),
    nominal = input.callerRows[i] * input.callerColumns[i];
  return {
    callerNominalTrayCellCount: nominal,
    callerUsableTrayCellCount: nominal - input.callerMissingCellCounts[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTraySkuIds: ["a", "b"],
  callerRows: [4, 5],
  callerColumns: [6, 8],
  callerMissingCellCounts: [1, 0],
  queryTraySkuId: "a",
} satisfies Input;
export const exampleOutput = {
  callerNominalTrayCellCount: 24,
  callerUsableTrayCellCount: 23,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/plug-tray-cell-count-lookup",
  title: "Plug Tray Cell Count Lookup",
  description:
    "Read actual tray SKU row/column and unusable-cell catalog; no universal plug-tray count table or observed germination/filled-cell inventory.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerNominalTrayCellCount",
      label: "Caller nominal tray cell count",
      kind: "number",
    },
    {
      id: "callerUsableTrayCellCount",
      label: "Caller usable tray cell count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTraySkuIds: value.callerTraySkuIds as readonly string[],
      callerRows: value.callerRows as readonly number[],
      callerColumns: value.callerColumns as readonly number[],
      callerMissingCellCounts:
        value.callerMissingCellCounts as readonly number[],
      queryTraySkuId: value.queryTraySkuId as string,
    }),
});
export const run = tool.execute;
export default tool;
