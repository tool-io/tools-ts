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
  strictlyIncreasing,
  intervals,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedPotShiftDayOrdinals: readonly number[];
  readonly callerSeasonEndDayOrdinal: number;
  readonly callerMinimumDaysBetweenShifts: number;
}>;
export type Output = Readonly<{
  readonly observedShiftCount: number;
  readonly observedInterShiftDays: readonly number[];
  readonly shiftIntervalsBelowCallerDurationIndices: readonly number[];
  readonly daysSinceLastShiftAtSeasonEnd: number;
}>;
const inputFields = [
  {
    id: "observedPotShiftDayOrdinals",
    label: "Observed pot shift day ordinals",
    kind: "numberList",
  },
  {
    id: "callerSeasonEndDayOrdinal",
    label: "Caller season end day ordinal",
    kind: "number",
  },
  {
    id: "callerMinimumDaysBetweenShifts",
    label: "Caller minimum days between shifts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerSeasonEndDayOrdinal, "callerSeasonEndDayOrdinal");
  nonnegative(
    input.callerMinimumDaysBetweenShifts,
    "callerMinimumDaysBetweenShifts",
  );
  strictlyIncreasing(input.observedPotShiftDayOrdinals, "shifts", 1);
  input.observedPotShiftDayOrdinals.forEach((v) => nonnegative(v, "shiftDay"));
  if (
    input.observedPotShiftDayOrdinals.at(-1)! > input.callerSeasonEndDayOrdinal
  )
    simpleError("season", "Observed shift beyond season end.");
  const intervals = input.observedPotShiftDayOrdinals
    .slice(1)
    .map((v, i) => v - input.observedPotShiftDayOrdinals[i]);
  return {
    observedShiftCount: input.observedPotShiftDayOrdinals.length,
    observedInterShiftDays: intervals,
    shiftIntervalsBelowCallerDurationIndices: intervals.flatMap((v, i) =>
      v < input.callerMinimumDaysBetweenShifts ? [i] : [],
    ),
    daysSinceLastShiftAtSeasonEnd:
      input.callerSeasonEndDayOrdinal -
      input.observedPotShiftDayOrdinals.at(-1)!,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPotShiftDayOrdinals: [0, 30, 75],
  callerSeasonEndDayOrdinal: 100,
  callerMinimumDaysBetweenShifts: 40,
} satisfies Input;
export const exampleOutput = {
  observedShiftCount: 3,
  observedInterShiftDays: [30, 45],
  shiftIntervalsBelowCallerDurationIndices: [0],
  daysSinceLastShiftAtSeasonEnd: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/step-up-schedule-shifts-per-season",
  title: "Step Up Schedule Shifts Per Season Lookup",
  description:
    "Audit actual pot-shift chronology and caller minimum intershift policy, not fixed shifts/season, forward sow/transplant window or a growth/root sufficiency schedule.",
  inputs: inputFields,
  outputs: [
    { id: "observedShiftCount", label: "Observed shift count", kind: "number" },
    {
      id: "observedInterShiftDays",
      label: "Observed inter shift days",
      kind: "numberList",
    },
    {
      id: "shiftIntervalsBelowCallerDurationIndices",
      label: "Shift intervals below caller duration indices",
      kind: "numberList",
    },
    {
      id: "daysSinceLastShiftAtSeasonEnd",
      label: "Days since last shift at season end",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPotShiftDayOrdinals:
        value.observedPotShiftDayOrdinals as readonly number[],
      callerSeasonEndDayOrdinal: value.callerSeasonEndDayOrdinal as number,
      callerMinimumDaysBetweenShifts:
        value.callerMinimumDaysBetweenShifts as number,
    }),
});
export const run = tool.execute;
export default tool;
