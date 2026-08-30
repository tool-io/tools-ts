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
  aligned,
  ratioWeighted,
} from "../shared.js";
export type Input = Readonly<{
  readonly seasonalObservedRhPercent: readonly number[];
  readonly callerSeasonalRhBaselinePercent: readonly number[];
  readonly representedDays: readonly number[];
  readonly callerAllowedBaselineDeparturePercent: number;
}>;
export type Output = Readonly<{
  readonly seasonalRhDeparturesPercent: readonly number[];
  readonly dayWeightedSignedRhDeparturePercent: number;
  readonly daysAboveCallerDeparture: number;
}>;
const inputFields = [
  {
    id: "seasonalObservedRhPercent",
    label: "Seasonal observed rh percent",
    kind: "numberList",
  },
  {
    id: "callerSeasonalRhBaselinePercent",
    label: "Caller seasonal rh baseline percent",
    kind: "numberList",
  },
  { id: "representedDays", label: "Represented days", kind: "numberList" },
  {
    id: "callerAllowedBaselineDeparturePercent",
    label: "Caller allowed baseline departure percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedDays.forEach((v) => nonnegative(v, "representedDays"));
  nonnegative(
    input.callerAllowedBaselineDeparturePercent,
    "callerAllowedBaselineDeparturePercent",
  );
  aligned(
    input.seasonalObservedRhPercent,
    input.callerSeasonalRhBaselinePercent,
    "seasonalObservedRhPercent",
  );
  aligned(
    input.seasonalObservedRhPercent,
    input.representedDays,
    "seasonalObservedRhPercent",
  );
  if (
    [
      ...input.seasonalObservedRhPercent,
      ...input.callerSeasonalRhBaselinePercent,
    ].some((v) => v < 0 || v > 100)
  )
    simpleError("rh", "RH percentages in [0,100] required.");
  const d = input.seasonalObservedRhPercent.map(
    (v, i) => v - input.callerSeasonalRhBaselinePercent[i],
  );
  return {
    seasonalRhDeparturesPercent: d,
    dayWeightedSignedRhDeparturePercent: ratioWeighted(
      d,
      input.representedDays,
    ),
    daysAboveCallerDeparture: input.representedDays.reduce(
      (s, v, i) =>
        s +
        (Math.abs(d[i]) > input.callerAllowedBaselineDeparturePercent ? v : 0),
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  seasonalObservedRhPercent: [40, 55, 50],
  callerSeasonalRhBaselinePercent: [40, 45, 50],
  representedDays: [30, 60, 30],
  callerAllowedBaselineDeparturePercent: 5,
} satisfies Input;
export const exampleOutput = {
  seasonalRhDeparturesPercent: [0, 10, 0],
  dayWeightedSignedRhDeparturePercent: 5,
  daysAboveCallerDeparture: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/seasonal-rh-drift-checker",
  title: "Seasonal RH Drift Allowance Checker",
  description:
    "Audit actual seasonal baseline-relative RH drift and represented-day exposure, preserving sign; not a daily range or implicit optimum seasonal setpoint.",
  inputs: inputFields,
  outputs: [
    {
      id: "seasonalRhDeparturesPercent",
      label: "Seasonal rh departures percent",
      kind: "numberList",
    },
    {
      id: "dayWeightedSignedRhDeparturePercent",
      label: "Day weighted signed rh departure percent",
      kind: "number",
    },
    {
      id: "daysAboveCallerDeparture",
      label: "Days above caller departure",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      seasonalObservedRhPercent:
        value.seasonalObservedRhPercent as readonly number[],
      callerSeasonalRhBaselinePercent:
        value.callerSeasonalRhBaselinePercent as readonly number[],
      representedDays: value.representedDays as readonly number[],
      callerAllowedBaselineDeparturePercent:
        value.callerAllowedBaselineDeparturePercent as number,
    }),
});
export const run = tool.execute;
export default tool;
