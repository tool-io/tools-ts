import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly occupiedSlotCountsByStore: readonly number[];
  readonly usableSlotCountsByStore: readonly number[];
  readonly blockedUnusableSlotCountsByStore: readonly number[];
}>;
export type Output = Readonly<{
  readonly usableSlotOccupancyPercentByStore: readonly number[];
  readonly pooledUsableSlotOccupancyPercent: number;
  readonly occupiedShareOfPhysicalSlotsPercent: number;
}>;
const inputFields = [
  {
    id: "occupiedSlotCountsByStore",
    label: "Occupied slot counts by store",
    kind: "numberList",
  },
  {
    id: "usableSlotCountsByStore",
    label: "Usable slot counts by store",
    kind: "numberList",
  },
  {
    id: "blockedUnusableSlotCountsByStore",
    label: "Blocked unusable slot counts by store",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.usableSlotCountsByStore.forEach((v) =>
    positive(v, "usableSlotCountsByStore"),
  );
  input.occupiedSlotCountsByStore.forEach((v) =>
    count(v, "occupiedSlotCountsByStore"),
  );
  input.usableSlotCountsByStore.forEach((v) =>
    count(v, "usableSlotCountsByStore"),
  );
  input.blockedUnusableSlotCountsByStore.forEach((v) =>
    count(v, "blockedUnusableSlotCountsByStore"),
  );
  aligned(
    input.occupiedSlotCountsByStore,
    input.usableSlotCountsByStore,
    "occupiedSlotCountsByStore",
  );
  aligned(
    input.occupiedSlotCountsByStore,
    input.blockedUnusableSlotCountsByStore,
    "occupiedSlotCountsByStore",
  );
  if (
    input.occupiedSlotCountsByStore.some(
      (v, i) => v > input.usableSlotCountsByStore[i],
    )
  )
    simpleError("occupancy", "Occupied inventory must fit usable store slots.");
  const occ = totalCount(input.occupiedSlotCountsByStore, "occupied"),
    usable = totalCount(input.usableSlotCountsByStore, "usable"),
    physical = count(
      usable + totalCount(input.blockedUnusableSlotCountsByStore, "blocked"),
      "physical",
    );
  return {
    usableSlotOccupancyPercentByStore: input.occupiedSlotCountsByStore.map(
      (v, i) => (100 * v) / input.usableSlotCountsByStore[i],
    ),
    pooledUsableSlotOccupancyPercent: (100 * occ) / usable,
    occupiedShareOfPhysicalSlotsPercent: (100 * occ) / physical,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  occupiedSlotCountsByStore: [80, 50],
  usableSlotCountsByStore: [100, 100],
  blockedUnusableSlotCountsByStore: [20, 0],
} satisfies Input;
export const exampleOutput = {
  usableSlotOccupancyPercentByStore: [80, 50],
  pooledUsableSlotOccupancyPercent: 65,
  occupiedShareOfPhysicalSlotsPercent: 59.09090909090909,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/storage-occupancy-fill-rate",
  title: "Collection Storage Occupancy Percent Fill Rate Calculator",
  description:
    "Keep occupied/usable/blocked storage slot inventories and unequal store denominators separate; physical empty slots are not all usable conservation capacity.",
  inputs: inputFields,
  outputs: [
    {
      id: "usableSlotOccupancyPercentByStore",
      label: "Usable slot occupancy percent by store",
      kind: "numberList",
    },
    {
      id: "pooledUsableSlotOccupancyPercent",
      label: "Pooled usable slot occupancy percent",
      kind: "number",
    },
    {
      id: "occupiedShareOfPhysicalSlotsPercent",
      label: "Occupied share of physical slots percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      occupiedSlotCountsByStore:
        value.occupiedSlotCountsByStore as readonly number[],
      usableSlotCountsByStore:
        value.usableSlotCountsByStore as readonly number[],
      blockedUnusableSlotCountsByStore:
        value.blockedUnusableSlotCountsByStore as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
