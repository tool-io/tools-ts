import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, movingAverage } from "../batch-shared.js";
export type Input = Readonly<{
  readonly openingInventoryUnits: number;
  readonly openingInventoryCostMinor: number;
  readonly purchaseZeroIssueOneCodes: readonly number[];
  readonly eventUnits: readonly number[];
  readonly purchaseEventTotalCostsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly endingUnits: number;
  readonly endingCostMinor: number;
  readonly issueCostsMinor: readonly number[];
  readonly costBalanceAfterEachEventMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "openingInventoryUnits",
    label: "Opening inventory units",
    kind: "number",
  },
  {
    id: "openingInventoryCostMinor",
    label: "Opening inventory cost minor",
    kind: "number",
  },
  {
    id: "purchaseZeroIssueOneCodes",
    label: "Purchase zero issue one codes",
    kind: "numberList",
  },
  { id: "eventUnits", label: "Event units", kind: "numberList" },
  {
    id: "purchaseEventTotalCostsMinor",
    label: "Purchase event total costs minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return movingAverage(
    input.openingInventoryUnits,
    input.openingInventoryCostMinor,
    input.purchaseZeroIssueOneCodes,
    input.eventUnits,
    input.purchaseEventTotalCostsMinor,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingInventoryUnits: 2,
  openingInventoryCostMinor: 20,
  purchaseZeroIssueOneCodes: [0, 1],
  eventUnits: [2, 3],
  purchaseEventTotalCostsMinor: [40, 0],
} satisfies Input;
export const exampleOutput = {
  endingUnits: 1,
  endingCostMinor: 15,
  issueCostsMinor: [0, 45],
  costBalanceAfterEachEventMinor: [60, 15],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/moving-average-cost-after-purchase-update",
  title: "Moving Average Cost After Purchase Update Calculator",
  description:
    "Replay purchase/issue events under perpetual moving-average cost, with half-up integer minor-unit issue allocation and final full issue clearing all cost; no negative inventory or periodic-average/FIFO substitution.",
  inputs: inputFields,
  outputs: [
    { id: "endingUnits", label: "Ending units", kind: "number" },
    { id: "endingCostMinor", label: "Ending cost minor", kind: "number" },
    { id: "issueCostsMinor", label: "Issue costs minor", kind: "numberList" },
    {
      id: "costBalanceAfterEachEventMinor",
      label: "Cost balance after each event minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      openingInventoryUnits: value.openingInventoryUnits as number,
      openingInventoryCostMinor: value.openingInventoryCostMinor as number,
      purchaseZeroIssueOneCodes:
        value.purchaseZeroIssueOneCodes as readonly number[],
      eventUnits: value.eventUnits as readonly number[],
      purchaseEventTotalCostsMinor:
        value.purchaseEventTotalCostsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
