import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly trayPreFillMediaVolumeMl: number;
  readonly trayPostFillMediaVolumeMl: number;
  readonly observedFilledCellCount: number;
  readonly independentlyMeasuredSpillMl: number;
}>;
export type Output = Readonly<{
  readonly netCellMediaVolumeMl: number;
  readonly pooledObservedMediaMlPerCell: number;
}>;
const inputFields = [
  {
    id: "trayPreFillMediaVolumeMl",
    label: "Tray pre fill media volume ml",
    kind: "number",
  },
  {
    id: "trayPostFillMediaVolumeMl",
    label: "Tray post fill media volume ml",
    kind: "number",
  },
  {
    id: "observedFilledCellCount",
    label: "Observed filled cell count",
    kind: "number",
  },
  {
    id: "independentlyMeasuredSpillMl",
    label: "Independently measured spill ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.trayPreFillMediaVolumeMl, "trayPreFillMediaVolumeMl");
  nonnegative(input.trayPostFillMediaVolumeMl, "trayPostFillMediaVolumeMl");
  nonnegative(
    input.independentlyMeasuredSpillMl,
    "independentlyMeasuredSpillMl",
  );
  bounded(input.observedFilledCellCount, "cells", 1, 1000000);
  const net =
    input.trayPreFillMediaVolumeMl -
    input.trayPostFillMediaVolumeMl -
    input.independentlyMeasuredSpillMl;
  if (net < 0)
    simpleError("inventory", "Net media inventory cannot be negative.");
  return {
    netCellMediaVolumeMl: net,
    pooledObservedMediaMlPerCell: net / input.observedFilledCellCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  trayPreFillMediaVolumeMl: 1000,
  trayPostFillMediaVolumeMl: 400,
  observedFilledCellCount: 20,
  independentlyMeasuredSpillMl: 100,
} satisfies Input;
export const exampleOutput = {
  netCellMediaVolumeMl: 500,
  pooledObservedMediaMlPerCell: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/plug-cell-volume-calculator",
  title: "Plug Cell Volume Calculator",
  description:
    "Calibrate actual plug-cell media fill from independent before/after/spill inventory and observed filled cells; not inferred geometry or nominal tray volume, compressibility/measurement compatibility external.",
  inputs: inputFields,
  outputs: [
    {
      id: "netCellMediaVolumeMl",
      label: "Net cell media volume ml",
      kind: "number",
    },
    {
      id: "pooledObservedMediaMlPerCell",
      label: "Pooled observed media ml per cell",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      trayPreFillMediaVolumeMl: value.trayPreFillMediaVolumeMl as number,
      trayPostFillMediaVolumeMl: value.trayPostFillMediaVolumeMl as number,
      observedFilledCellCount: value.observedFilledCellCount as number,
      independentlyMeasuredSpillMl:
        value.independentlyMeasuredSpillMl as number,
    }),
});
export const run = tool.execute;
export default tool;
