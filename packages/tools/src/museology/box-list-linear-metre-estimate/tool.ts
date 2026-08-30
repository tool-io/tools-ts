import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  rowInventory,
} from "../shared.js";
export type Input = Readonly<{
  readonly inventoriedItemCountsByBox: readonly number[];
  readonly measuredOccupiedBoxWidthsM: readonly number[];
  readonly representedBoxCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalRepresentedInventoryItems: number;
  readonly totalRepresentedLinearMetres: number;
  readonly inventoryItemsPerLinearMetre: number;
}>;
const inputFields = [
  {
    id: "inventoriedItemCountsByBox",
    label: "Inventoried item counts by box",
    kind: "numberList",
  },
  {
    id: "measuredOccupiedBoxWidthsM",
    label: "Measured occupied box widths m",
    kind: "numberList",
  },
  {
    id: "representedBoxCounts",
    label: "Represented box counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredOccupiedBoxWidthsM.forEach((v) =>
    positive(v, "measuredOccupiedBoxWidthsM"),
  );
  input.inventoriedItemCountsByBox.forEach((v) =>
    count(v, "inventoriedItemCountsByBox"),
  );
  input.representedBoxCounts.forEach((v) => count(v, "representedBoxCounts"));
  aligned(
    input.inventoriedItemCountsByBox,
    input.measuredOccupiedBoxWidthsM,
    "inventoriedItemCountsByBox",
  );
  aligned(
    input.inventoriedItemCountsByBox,
    input.representedBoxCounts,
    "inventoriedItemCountsByBox",
  );
  const n = rowInventory(
      input.inventoriedItemCountsByBox,
      input.representedBoxCounts,
    ),
    length = positive(
      input.measuredOccupiedBoxWidthsM.reduce(
        (s, v, i) => s + v * input.representedBoxCounts[i],
        0,
      ),
      "extent",
    );
  return {
    totalRepresentedInventoryItems: n,
    totalRepresentedLinearMetres: length,
    inventoryItemsPerLinearMetre: n / length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  inventoriedItemCountsByBox: [10, 30],
  measuredOccupiedBoxWidthsM: [0.2, 0.3],
  representedBoxCounts: [1, 2],
} satisfies Input;
export const exampleOutput = {
  totalRepresentedInventoryItems: 70,
  totalRepresentedLinearMetres: 0.8,
  inventoryItemsPerLinearMetre: 87.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/box-list-linear-metre-estimate",
  title: "Box List Item Count per Linear Metre Estimate Calculator",
  description:
    "Expand heterogeneous counted box-list inventory and measured widths to actual item density per linear metre; not a fixed box conversion or universal item density.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalRepresentedInventoryItems",
      label: "Total represented inventory items",
      kind: "number",
    },
    {
      id: "totalRepresentedLinearMetres",
      label: "Total represented linear metres",
      kind: "number",
    },
    {
      id: "inventoryItemsPerLinearMetre",
      label: "Inventory items per linear metre",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      inventoriedItemCountsByBox:
        value.inventoriedItemCountsByBox as readonly number[],
      measuredOccupiedBoxWidthsM:
        value.measuredOccupiedBoxWidthsM as readonly number[],
      representedBoxCounts: value.representedBoxCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
