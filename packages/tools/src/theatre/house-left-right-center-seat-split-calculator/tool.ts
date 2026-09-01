import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
  sum,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly seatZoneLeftCenterRightCodes: readonly number[];
  readonly seatBlockedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly usableLeftCenterRightSeatCounts: readonly number[];
  readonly blockedLeftCenterRightSeatCounts: readonly number[];
  readonly usableSeatTotal: number;
}>;
const inputFields = [
  {
    id: "seatZoneLeftCenterRightCodes",
    label: "Seat zone left center right codes",
    kind: "numberList",
  },
  { id: "seatBlockedFlags", label: "Seat blocked flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.seatBlockedFlags, "seatBlockedFlags");
  aligned(
    input.seatZoneLeftCenterRightCodes,
    input.seatBlockedFlags,
    "seatZoneLeftCenterRightCodes",
  );
  input.seatZoneLeftCenterRightCodes.forEach((v) => bounded(v, "zone", 0, 2));
  const usable = [0, 1, 2].map(
      (c) =>
        input.seatZoneLeftCenterRightCodes.filter(
          (v, i) => v === c && !input.seatBlockedFlags[i],
        ).length,
    ),
    blocked = [0, 1, 2].map(
      (c) =>
        input.seatZoneLeftCenterRightCodes.filter(
          (v, i) => v === c && input.seatBlockedFlags[i],
        ).length,
    );
  return {
    usableLeftCenterRightSeatCounts: usable,
    blockedLeftCenterRightSeatCounts: blocked,
    usableSeatTotal: sum(usable),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  seatZoneLeftCenterRightCodes: [0, 1, 2, 1, 2],
  seatBlockedFlags: [0, 1, 0, 0, 1],
} satisfies Input;
export const exampleOutput = {
  usableLeftCenterRightSeatCounts: [1, 1, 1],
  blockedLeftCenterRightSeatCounts: [0, 1, 1],
  usableSeatTotal: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/house-left-right-center-seat-split-calculator",
  title: "House Left Right Center Seat Split Calculator",
  description:
    "Inventory actual observed seat zones/block status instead of splitting a scalar total by guessed proportions; no accessible-seat compliance, seat numbering inference or sold inventory reconciliation.",
  inputs: inputFields,
  outputs: [
    {
      id: "usableLeftCenterRightSeatCounts",
      label: "Usable left center right seat counts",
      kind: "numberList",
    },
    {
      id: "blockedLeftCenterRightSeatCounts",
      label: "Blocked left center right seat counts",
      kind: "numberList",
    },
    { id: "usableSeatTotal", label: "Usable seat total", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      seatZoneLeftCenterRightCodes:
        value.seatZoneLeftCenterRightCodes as readonly number[],
      seatBlockedFlags: value.seatBlockedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
