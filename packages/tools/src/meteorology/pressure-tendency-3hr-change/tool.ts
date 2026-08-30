import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, interpolate } from "../shared.js";

export type Input = Readonly<{
  readonly observationHours: readonly number[];
  readonly observedPressuresHpa: readonly number[];
  readonly reportHour: number;
}>;
export type Output = Readonly<{
  readonly observedThreeHourPressureChangeHpa: number;
  readonly bracketStartPressureHpa: number;
  readonly bracketEndPressureHpa: number;
}>;
const inputFields = [
  { id: "observationHours", label: "Observation hours", kind: "numberList" },
  {
    id: "observedPressuresHpa",
    label: "Observed pressures hpa",
    kind: "numberList",
  },
  { id: "reportHour", label: "Report hour", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const bracketStartPressureHpa = interpolate(
      input.observationHours,
      input.observedPressuresHpa,
      input.reportHour - 3,
    ),
    bracketEndPressureHpa = interpolate(
      input.observationHours,
      input.observedPressuresHpa,
      input.reportHour,
    );
  input.observedPressuresHpa.forEach((v) => positive(v, "pressure"));
  return {
    observedThreeHourPressureChangeHpa:
      bracketEndPressureHpa - bracketStartPressureHpa,
    bracketStartPressureHpa,
    bracketEndPressureHpa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationHours: [0, 1, 3, 4],
  observedPressuresHpa: [1000, 1001, 1003, 1000],
  reportHour: 4,
} satisfies Input;
export const exampleOutput = {
  observedThreeHourPressureChangeHpa: -1,
  bracketStartPressureHpa: 1001,
  bracketEndPressureHpa: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/pressure-tendency-3hr-change",
  title: "Pressure Tendency 3HR Change",
  description:
    "Calculate signed observed three-hour pressure tendency with bracketed piecewise-linear samples at report time; no unobserved extrapolation or synoptic symbol/weather inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedThreeHourPressureChangeHpa",
      label: "Observed three hour pressure change hpa",
      kind: "number",
    },
    {
      id: "bracketStartPressureHpa",
      label: "Bracket start pressure hpa",
      kind: "number",
    },
    {
      id: "bracketEndPressureHpa",
      label: "Bracket end pressure hpa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observationHours: value.observationHours as readonly number[],
      observedPressuresHpa: value.observedPressuresHpa as readonly number[],
      reportHour: value.reportHour as number,
    }),
});
export const run = tool.execute;
export default tool;
