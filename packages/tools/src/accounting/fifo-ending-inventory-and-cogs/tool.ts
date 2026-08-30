import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fifo } from "../batch-shared.js";
export type Input = Readonly<{
  readonly oldestFirstLayerUnits: readonly number[];
  readonly layerUnitCostsMinor: readonly number[];
  readonly unitsIssued: number;
}>;
export type Output = Readonly<{
  readonly issuedCostMinor: number;
  readonly endingInventoryMinor: number;
  readonly remainingLayerUnits: readonly number[];
}>;
const inputFields = [
  {
    id: "oldestFirstLayerUnits",
    label: "Oldest first layer units",
    kind: "numberList",
  },
  {
    id: "layerUnitCostsMinor",
    label: "Layer unit costs minor",
    kind: "numberList",
  },
  { id: "unitsIssued", label: "Units issued", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return fifo(
    input.oldestFirstLayerUnits,
    input.layerUnitCostsMinor,
    input.unitsIssued,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  oldestFirstLayerUnits: [5, 5],
  layerUnitCostsMinor: [10, 20],
  unitsIssued: 7,
} satisfies Input;
export const exampleOutput = {
  issuedCostMinor: 90,
  endingInventoryMinor: 60,
  remainingLayerUnits: [0, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/fifo-ending-inventory-and-cogs",
  title: "FIFO Ending Inventory And COGS Calculator",
  description:
    "Cost actual FIFO issues across all oldest-first layers and reconcile remaining cost inventory; unlike existing oldest-layer quantity tracker, this allocates multiple cost layers and rejects stockout. One issue after these receipts, not a chronological perpetual ledger.",
  inputs: inputFields,
  outputs: [
    { id: "issuedCostMinor", label: "Issued cost minor", kind: "number" },
    {
      id: "endingInventoryMinor",
      label: "Ending inventory minor",
      kind: "number",
    },
    {
      id: "remainingLayerUnits",
      label: "Remaining layer units",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      oldestFirstLayerUnits: value.oldestFirstLayerUnits as readonly number[],
      layerUnitCostsMinor: value.layerUnitCostsMinor as readonly number[],
      unitsIssued: value.unitsIssued as number,
    }),
});
export const run = tool.execute;
export default tool;
