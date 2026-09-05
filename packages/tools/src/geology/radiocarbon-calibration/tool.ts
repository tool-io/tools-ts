import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, crossings } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly calendarAgesYears: readonly number[];
  readonly callerRadiocarbonCurveYears: readonly number[];
  readonly observedRadiocarbonAgeYears: number;
}>;
export type Output = Readonly<{
  readonly matchingCalendarAgesYears: readonly number[];
}>;
const inputFields = [
  { id: "calendarAgesYears", label: "Calendar ages years", kind: "numberList" },
  {
    id: "callerRadiocarbonCurveYears",
    label: "Caller radiocarbon curve years",
    kind: "numberList",
  },
  {
    id: "observedRadiocarbonAgeYears",
    label: "Observed radiocarbon age years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchingCalendarAgesYears: crossings(
      input.calendarAgesYears,
      input.callerRadiocarbonCurveYears,
      input.observedRadiocarbonAgeYears,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calendarAgesYears: [0, 1, 2, 3],
  callerRadiocarbonCurveYears: [0, 2, 0, 2],
  observedRadiocarbonAgeYears: 1,
} satisfies Input;
export const exampleOutput = {
  matchingCalendarAgesYears: [0.5, 1.5, 2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/radiocarbon-calibration",
  title: "Geology Radiocarbon Calibration Calculator",
  description:
    "Invert independently verified matching calibration curve retaining all piecewise-linear crossings/plateau sample coordinates; no unique calibrated date or probability posterior. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingCalendarAgesYears",
      label: "Matching calendar ages years",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      calendarAgesYears: value.calendarAgesYears as readonly number[],
      callerRadiocarbonCurveYears:
        value.callerRadiocarbonCurveYears as readonly number[],
      observedRadiocarbonAgeYears: value.observedRadiocarbonAgeYears as number,
    }),
});
export const run = tool.execute;
export default tool;
