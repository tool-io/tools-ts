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
  readonly rollingBenchWidthM: number;
  readonly rollingBenchLengthM: number;
  readonly trayWidthM: number;
  readonly trayLengthM: number;
  readonly callerTrayGapM: number;
}>;
export type Output = Readonly<{
  readonly unrotatedWholeTrayCapacity: number;
  readonly rotatedWholeTrayCapacity: number;
  readonly selectedWholeTrayCapacity: number;
  readonly selectedOrientation: string;
}>;
const inputFields = [
  { id: "rollingBenchWidthM", label: "Rolling bench width m", kind: "number" },
  {
    id: "rollingBenchLengthM",
    label: "Rolling bench length m",
    kind: "number",
  },
  { id: "trayWidthM", label: "Tray width m", kind: "number" },
  { id: "trayLengthM", label: "Tray length m", kind: "number" },
  { id: "callerTrayGapM", label: "Caller tray gap m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.rollingBenchWidthM, "rollingBenchWidthM");
  positive(input.rollingBenchLengthM, "rollingBenchLengthM");
  positive(input.trayWidthM, "trayWidthM");
  positive(input.trayLengthM, "trayLengthM");
  nonnegative(input.callerTrayGapM, "callerTrayGapM");
  const a =
      fittedCounts(
        input.rollingBenchWidthM,
        input.trayWidthM,
        input.callerTrayGapM,
      ) *
      fittedCounts(
        input.rollingBenchLengthM,
        input.trayLengthM,
        input.callerTrayGapM,
      ),
    b =
      fittedCounts(
        input.rollingBenchWidthM,
        input.trayLengthM,
        input.callerTrayGapM,
      ) *
      fittedCounts(
        input.rollingBenchLengthM,
        input.trayWidthM,
        input.callerTrayGapM,
      );
  integer(a, "capacity");
  integer(b, "capacity");
  return {
    unrotatedWholeTrayCapacity: a,
    rotatedWholeTrayCapacity: b,
    selectedWholeTrayCapacity: Math.max(a, b),
    selectedOrientation: a >= b ? "unrotated" : "rotated",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rollingBenchWidthM: 2,
  rollingBenchLengthM: 3,
  trayWidthM: 0.5,
  trayLengthM: 1,
  callerTrayGapM: 0,
} satisfies Input;
export const exampleOutput = {
  unrotatedWholeTrayCapacity: 12,
  rotatedWholeTrayCapacity: 12,
  selectedWholeTrayCapacity: 12,
  selectedOrientation: "unrotated",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/rolling-bench-tray-capacity",
  title: "Rolling Bench Tray Capacity Calculator",
  description:
    "Compare actual uniform tray orientation packing on usable rolling bench, ties unrotated; not arbitrary mixed-orientation optimization, floor aisle allocation or rolling-system safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "unrotatedWholeTrayCapacity",
      label: "Unrotated whole tray capacity",
      kind: "number",
    },
    {
      id: "rotatedWholeTrayCapacity",
      label: "Rotated whole tray capacity",
      kind: "number",
    },
    {
      id: "selectedWholeTrayCapacity",
      label: "Selected whole tray capacity",
      kind: "number",
    },
    {
      id: "selectedOrientation",
      label: "Selected orientation",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      rollingBenchWidthM: value.rollingBenchWidthM as number,
      rollingBenchLengthM: value.rollingBenchLengthM as number,
      trayWidthM: value.trayWidthM as number,
      trayLengthM: value.trayLengthM as number,
      callerTrayGapM: value.callerTrayGapM as number,
    }),
});
export const run = tool.execute;
export default tool;
