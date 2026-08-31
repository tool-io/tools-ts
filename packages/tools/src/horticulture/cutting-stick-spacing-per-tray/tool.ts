import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  positive,
  nonnegative,
  fittedCounts,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly usableTrayWidthCm: number;
  readonly usableTrayLengthCm: number;
  readonly callerCuttingWidthCm: number;
  readonly callerCuttingLengthCm: number;
  readonly callerCuttingGapCm: number;
}>;
export type Output = Readonly<{
  readonly cuttingColumns: number;
  readonly cuttingRows: number;
  readonly plannedWholeCuttingPositions: number;
  readonly unusedOuterWidthCm: number;
  readonly unusedOuterLengthCm: number;
}>;
const inputFields = [
  { id: "usableTrayWidthCm", label: "Usable tray width cm", kind: "number" },
  { id: "usableTrayLengthCm", label: "Usable tray length cm", kind: "number" },
  {
    id: "callerCuttingWidthCm",
    label: "Caller cutting width cm",
    kind: "number",
  },
  {
    id: "callerCuttingLengthCm",
    label: "Caller cutting length cm",
    kind: "number",
  },
  { id: "callerCuttingGapCm", label: "Caller cutting gap cm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerCuttingWidthCm, "callerCuttingWidthCm");
  positive(input.callerCuttingLengthCm, "callerCuttingLengthCm");
  nonnegative(input.usableTrayWidthCm, "usableTrayWidthCm");
  nonnegative(input.usableTrayLengthCm, "usableTrayLengthCm");
  nonnegative(input.callerCuttingGapCm, "callerCuttingGapCm");
  const columns = fittedCounts(
      input.usableTrayWidthCm,
      input.callerCuttingWidthCm,
      input.callerCuttingGapCm,
    ),
    rows = fittedCounts(
      input.usableTrayLengthCm,
      input.callerCuttingLengthCm,
      input.callerCuttingGapCm,
    ),
    used = (count: number, item: number) =>
      count === 0 ? 0 : count * item + (count - 1) * input.callerCuttingGapCm;
  return {
    cuttingColumns: columns,
    cuttingRows: rows,
    plannedWholeCuttingPositions: integer(columns * rows, "positions"),
    unusedOuterWidthCm:
      input.usableTrayWidthCm - used(columns, input.callerCuttingWidthCm),
    unusedOuterLengthCm:
      input.usableTrayLengthCm - used(rows, input.callerCuttingLengthCm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  usableTrayWidthCm: 20,
  usableTrayLengthCm: 30,
  callerCuttingWidthCm: 4,
  callerCuttingLengthCm: 5,
  callerCuttingGapCm: 1,
} satisfies Input;
export const exampleOutput = {
  cuttingColumns: 4,
  cuttingRows: 5,
  plannedWholeCuttingPositions: 20,
  unusedOuterWidthCm: 1,
  unusedOuterLengthCm: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/cutting-stick-spacing-per-tray",
  title: "Cutting Stick Spacing Per Tray Calculator",
  description:
    "Plan actual rectangular cutting envelopes with gaps only between occupied positions and explicit usable tray dimensions; no rooting/crowding recommendation or cell-count table.",
  inputs: inputFields,
  outputs: [
    { id: "cuttingColumns", label: "Cutting columns", kind: "number" },
    { id: "cuttingRows", label: "Cutting rows", kind: "number" },
    {
      id: "plannedWholeCuttingPositions",
      label: "Planned whole cutting positions",
      kind: "number",
    },
    {
      id: "unusedOuterWidthCm",
      label: "Unused outer width cm",
      kind: "number",
    },
    {
      id: "unusedOuterLengthCm",
      label: "Unused outer length cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      usableTrayWidthCm: value.usableTrayWidthCm as number,
      usableTrayLengthCm: value.usableTrayLengthCm as number,
      callerCuttingWidthCm: value.callerCuttingWidthCm as number,
      callerCuttingLengthCm: value.callerCuttingLengthCm as number,
      callerCuttingGapCm: value.callerCuttingGapCm as number,
    }),
});
export const run = tool.execute;
export default tool;
