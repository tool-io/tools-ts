import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  positive,
  nonnegative,
  count,
  aligned,
  ordered,
  mean,
} from "../shared.js";

export type Input = Readonly<{
  readonly observationHours: readonly number[];
  readonly cellCounts: readonly number[];
  readonly windowObservations: number;
  readonly maximumRelativeRange: number;
}>;
export type Output = Readonly<{
  readonly windowMeanCellCount: number;
  readonly relativeRange: number;
  readonly stationaryWindow: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.observationHours, input.cellCounts, "observationHours");
  ordered(input.observationHours, "observationHours");
  input.cellCounts.forEach((v) => positive(v, "cellCounts"));
  count(input.windowObservations, "windowObservations", 2);
  nonnegative(input.maximumRelativeRange, "maximumRelativeRange");
  if (input.windowObservations > input.cellCounts.length)
    simpleError("windowObservations", "Window cannot exceed observed counts.");
  const window = input.cellCounts.slice(-input.windowObservations),
    windowMeanCellCount = mean(window);
  let minimum = window[0],
    maximum = window[0];
  for (const v of window) {
    minimum = Math.min(minimum, v);
    maximum = Math.max(maximum, v);
  }
  const relativeRange = (maximum - minimum) / windowMeanCellCount;
  return {
    windowMeanCellCount,
    relativeRange,
    stationaryWindow: relativeRange <= input.maximumRelativeRange,
  };
};
export const exampleInput = {
  observationHours: [0, 1, 2, 3],
  cellCounts: [10, 100, 105, 100],
  windowObservations: 3,
  maximumRelativeRange: 0.1,
} satisfies Input;
export const exampleOutput = {
  windowMeanCellCount: 101.66666666666667,
  relativeRange: 0.04918032786885246,
  stationaryWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/stationary-phase-window-audit",
  title: "Stationary Phase Window Audit",
  description:
    "Screen the final growth-curve window for a caller-defined relative stability band, rather than equating one count with carrying capacity.",
  inputs: [
    { id: "observationHours", label: "Observation hours", kind: "numberList" },
    { id: "cellCounts", label: "Cell counts", kind: "numberList" },
    {
      id: "windowObservations",
      label: "Window observations",
      kind: "integer",
      minimum: 2,
    },
    {
      id: "maximumRelativeRange",
      label: "Maximum relative range",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "windowMeanCellCount",
      label: "Window mean cell count",
      kind: "number",
    },
    { id: "relativeRange", label: "Relative range", kind: "number" },
    { id: "stationaryWindow", label: "Stationary window", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      observationHours: value.observationHours as readonly number[],
      cellCounts: value.cellCounts as readonly number[],
      windowObservations: value.windowObservations as number,
      maximumRelativeRange: value.maximumRelativeRange as number,
    }),
});
export const run = tool.execute;
export default tool;
