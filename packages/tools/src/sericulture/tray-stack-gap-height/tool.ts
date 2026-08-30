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
  nonnegative,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly roomClearHeightM: number;
  readonly trayCount: number;
  readonly trayThicknessM: number;
  readonly bottomClearanceM: number;
  readonly topClearanceM: number;
  readonly callerMinimumGapM: number;
}>;
export type Output = Readonly<{
  readonly equalIntertrayGapM: number;
  readonly callerGapMarginM: number;
}>;
const inputFields = [
  { id: "roomClearHeightM", label: "Room clear height m", kind: "number" },
  { id: "trayCount", label: "Tray count", kind: "integer" },
  { id: "trayThicknessM", label: "Tray thickness m", kind: "number" },
  { id: "bottomClearanceM", label: "Bottom clearance m", kind: "number" },
  { id: "topClearanceM", label: "Top clearance m", kind: "number" },
  { id: "callerMinimumGapM", label: "Caller minimum gap m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.roomClearHeightM, "roomClearHeightM");
  positive(input.trayCount, "trayCount");
  nonnegative(input.trayThicknessM, "trayThicknessM");
  nonnegative(input.bottomClearanceM, "bottomClearanceM");
  nonnegative(input.topClearanceM, "topClearanceM");
  nonnegative(input.callerMinimumGapM, "callerMinimumGapM");
  count(input.trayCount, "trayCount");
  if (input.trayCount < 2)
    simpleError(
      "trayCount",
      "At least two trays required for an intertray gap.",
    );
  const occupied = nonnegative(
    input.bottomClearanceM +
      input.topClearanceM +
      input.trayCount * input.trayThicknessM,
    "trayThicknessM",
  );
  const slack = input.roomClearHeightM - occupied;
  if (slack < -8 * Number.EPSILON * Math.max(input.roomClearHeightM, occupied))
    simpleError(
      "roomClearHeightM",
      "Trays and edge clearances exceed room height.",
    );
  const available = Math.max(0, slack),
    equalIntertrayGapM = available / (input.trayCount - 1);
  return {
    equalIntertrayGapM,
    callerGapMarginM: equalIntertrayGapM - input.callerMinimumGapM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  roomClearHeightM: 2,
  trayCount: 4,
  trayThicknessM: 0.1,
  bottomClearanceM: 0.2,
  topClearanceM: 0.3,
  callerMinimumGapM: 0.2,
} satisfies Input;
export const exampleOutput = {
  equalIntertrayGapM: 0.3666666666666667,
  callerGapMarginM: 0.16666666666666669,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/tray-stack-gap-height",
  title: "Tray Stack Gap Height",
  description:
    "Calculate equal clear intertray gap after tray thickness and room edge clearances and compare caller minimum; airflow, rack strength and ergonomics are not certified.",
  inputs: inputFields,
  outputs: [
    {
      id: "equalIntertrayGapM",
      label: "Equal intertray gap m",
      kind: "number",
    },
    { id: "callerGapMarginM", label: "Caller gap margin m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      roomClearHeightM: value.roomClearHeightM as number,
      trayCount: value.trayCount as number,
      trayThicknessM: value.trayThicknessM as number,
      bottomClearanceM: value.bottomClearanceM as number,
      topClearanceM: value.topClearanceM as number,
      callerMinimumGapM: value.callerMinimumGapM as number,
    }),
});
export const run = tool.execute;
export default tool;
