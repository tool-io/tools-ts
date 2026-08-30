import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly previousWeekKm: number;
  readonly maxIncreaseFraction: number;
  readonly plannedWeekKm: number;
}>;
export type Output = Readonly<{
  readonly maximumPlannedKm: number;
  readonly excessKm: number;
  readonly withinCap: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.previousWeekKm < 0 ||
    input.plannedWeekKm < 0 ||
    input.maxIncreaseFraction < 0
  )
    simpleError(
      "previousWeekKm",
      "Nonnegative mileage and caller-defined maximum growth required.",
    );
  const maximumPlannedKm =
    input.previousWeekKm * (1 + input.maxIncreaseFraction);
  return {
    maximumPlannedKm,
    excessKm: Math.max(0, input.plannedWeekKm - maximumPlannedKm),
    withinCap: input.plannedWeekKm <= maximumPlannedKm,
  };
};
export const exampleInput = {
  previousWeekKm: 20,
  maxIncreaseFraction: 0.1,
  plannedWeekKm: 25,
} satisfies Input;
export const exampleOutput = {
  maximumPlannedKm: 22,
  excessKm: 3,
  withinCap: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/minimalist-mileage-progression",
  title: "Minimalist Mileage Progression",
  description:
    "Screen proposed mileage increase against a caller-selected transition cap.",
  inputs: [
    { id: "previousWeekKm", label: "Previous week km", kind: "number" },
    {
      id: "maxIncreaseFraction",
      label: "Max increase fraction",
      kind: "number",
    },
    { id: "plannedWeekKm", label: "Planned week km", kind: "number" },
  ],
  outputs: [
    { id: "maximumPlannedKm", label: "Maximum planned km", kind: "number" },
    { id: "excessKm", label: "Excess km", kind: "number" },
    { id: "withinCap", label: "Within cap", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      previousWeekKm: value.previousWeekKm as number,
      maxIncreaseFraction: value.maxIncreaseFraction as number,
      plannedWeekKm: value.plannedWeekKm as number,
    }),
});
export const run = tool.execute;
export default tool;
