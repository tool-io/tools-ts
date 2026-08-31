import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly seatClearWidthsCm: readonly number[];
  readonly measuredHipBreadthsCm: readonly number[];
  readonly clothingAddedBreadthsCm: readonly number[];
  readonly callerRequiredTotalSideClearanceCm: number;
}>;
export type Output = Readonly<{
  readonly clothedHipBreadthsCm: readonly number[];
  readonly signedSeatWidthMarginsCm: readonly number[];
  readonly withinCallerHipSeatFitFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "seatClearWidthsCm",
    label: "Seat clear widths cm",
    kind: "numberList",
  },
  {
    id: "measuredHipBreadthsCm",
    label: "Measured hip breadths cm",
    kind: "numberList",
  },
  {
    id: "clothingAddedBreadthsCm",
    label: "Clothing added breadths cm",
    kind: "numberList",
  },
  {
    id: "callerRequiredTotalSideClearanceCm",
    label: "Caller required total side clearance cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.seatClearWidthsCm.forEach((v) => nonnegative(v, "seatClearWidthsCm"));
  input.measuredHipBreadthsCm.forEach((v) =>
    nonnegative(v, "measuredHipBreadthsCm"),
  );
  input.clothingAddedBreadthsCm.forEach((v) =>
    nonnegative(v, "clothingAddedBreadthsCm"),
  );
  nonnegative(
    input.callerRequiredTotalSideClearanceCm,
    "callerRequiredTotalSideClearanceCm",
  );
  aligned(
    input.seatClearWidthsCm,
    input.measuredHipBreadthsCm,
    "seatClearWidthsCm",
  );
  aligned(
    input.seatClearWidthsCm,
    input.clothingAddedBreadthsCm,
    "seatClearWidthsCm",
  );
  const b = input.measuredHipBreadthsCm.map(
      (v, i) => v + input.clothingAddedBreadthsCm[i],
    ),
    m = b.map(
      (v, i) =>
        input.seatClearWidthsCm[i] -
        v -
        input.callerRequiredTotalSideClearanceCm,
    );
  return {
    clothedHipBreadthsCm: b,
    signedSeatWidthMarginsCm: m,
    withinCallerHipSeatFitFlags: m.map((v) => (v >= 0 ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  seatClearWidthsCm: [45, 50],
  measuredHipBreadthsCm: [40, 47],
  clothingAddedBreadthsCm: [2, 2],
  callerRequiredTotalSideClearanceCm: 4,
} satisfies Input;
export const exampleOutput = {
  clothedHipBreadthsCm: [42, 49],
  signedSeatWidthMarginsCm: [-1, -3],
  withinCallerHipSeatFitFlags: [0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/hip-breadth-seat-fit-checker",
  title: "Anthropometric Hip Breadth Percentile Seat Width Fit Checker",
  description:
    "Audit actual hip/seat samples with separately measured clothing breadth and total caller side-clearance allowance; does not invent demographic percentiles or infer armrest clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "clothedHipBreadthsCm",
      label: "Clothed hip breadths cm",
      kind: "numberList",
    },
    {
      id: "signedSeatWidthMarginsCm",
      label: "Signed seat width margins cm",
      kind: "numberList",
    },
    {
      id: "withinCallerHipSeatFitFlags",
      label: "Within caller hip seat fit flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      seatClearWidthsCm: value.seatClearWidthsCm as readonly number[],
      measuredHipBreadthsCm: value.measuredHipBreadthsCm as readonly number[],
      clothingAddedBreadthsCm:
        value.clothingAddedBreadthsCm as readonly number[],
      callerRequiredTotalSideClearanceCm:
        value.callerRequiredTotalSideClearanceCm as number,
    }),
});
export const run = tool.execute;
export default tool;
