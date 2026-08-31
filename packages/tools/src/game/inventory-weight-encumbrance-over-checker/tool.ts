import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly itemCounts: readonly number[];
  readonly itemUnitWeights: readonly number[];
  readonly callerFixedEquippedWeight: number;
  readonly callerCarryCapacity: number;
}>;
export type Output = Readonly<{
  readonly totalModeledCarriedWeight: number;
  readonly signedCapacityMargin: number;
  readonly overCallerCapacity: boolean;
  readonly minimumWeightReductionToCallerCapacity: number;
}>;
const inputFields = [
  { id: "itemCounts", label: "Item counts", kind: "numberList" },
  { id: "itemUnitWeights", label: "Item unit weights", kind: "numberList" },
  {
    id: "callerFixedEquippedWeight",
    label: "Caller fixed equipped weight",
    kind: "number",
  },
  { id: "callerCarryCapacity", label: "Caller carry capacity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.itemUnitWeights.forEach((v) => nonnegative(v, "itemUnitWeights"));
  nonnegative(input.callerFixedEquippedWeight, "callerFixedEquippedWeight");
  nonnegative(input.callerCarryCapacity, "callerCarryCapacity");
  input.itemCounts.forEach((v) => count(v, "itemCounts"));
  aligned(input.itemCounts, input.itemUnitWeights, "itemCounts");
  const load = input.itemCounts.reduce(
      (s, v, i) => s + v * input.itemUnitWeights[i],
      input.callerFixedEquippedWeight,
    ),
    margin = input.callerCarryCapacity - load;
  return {
    totalModeledCarriedWeight: load,
    signedCapacityMargin: margin,
    overCallerCapacity: margin < 0,
    minimumWeightReductionToCallerCapacity: Math.max(0, -margin),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  itemCounts: [2, 3],
  itemUnitWeights: [5, 1],
  callerFixedEquippedWeight: 2,
  callerCarryCapacity: 12,
} satisfies Input;
export const exampleOutput = {
  totalModeledCarriedWeight: 15,
  signedCapacityMargin: -3,
  overCallerCapacity: true,
  minimumWeightReductionToCallerCapacity: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/inventory-weight-encumbrance-over-checker",
  title: "Inventory Encumbrance Over-Limit Check",
  description:
    "Reconcile counted inventory and extra equipped weight against explicit caller capacity, preserving negative margin; no assumed game encumbrance thresholds or suggested item disposal.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalModeledCarriedWeight",
      label: "Total modeled carried weight",
      kind: "number",
    },
    {
      id: "signedCapacityMargin",
      label: "Signed capacity margin",
      kind: "number",
    },
    {
      id: "overCallerCapacity",
      label: "Over caller capacity",
      kind: "boolean",
    },
    {
      id: "minimumWeightReductionToCallerCapacity",
      label: "Minimum weight reduction to caller capacity",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      itemCounts: value.itemCounts as readonly number[],
      itemUnitWeights: value.itemUnitWeights as readonly number[],
      callerFixedEquippedWeight: value.callerFixedEquippedWeight as number,
      callerCarryCapacity: value.callerCarryCapacity as number,
    }),
});
export const run = tool.execute;
export default tool;
