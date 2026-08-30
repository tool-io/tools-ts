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
  aligned,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly programPhaseLux: readonly number[];
  readonly programHoursPerDisplayDay: readonly number[];
  readonly remainingObjectLuxHours: number;
}>;
export type Output = Readonly<{
  readonly programLuxHoursPerDay: number;
  readonly maximumCompleteDisplayDays: number;
  readonly residualLuxHours: number;
}>;
const inputFields = [
  { id: "programPhaseLux", label: "Program phase lux", kind: "numberList" },
  {
    id: "programHoursPerDisplayDay",
    label: "Program hours per display day",
    kind: "numberList",
  },
  {
    id: "remainingObjectLuxHours",
    label: "Remaining object lux hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.programPhaseLux.forEach((v) => nonnegative(v, "programPhaseLux"));
  input.programHoursPerDisplayDay.forEach((v) =>
    nonnegative(v, "programHoursPerDisplayDay"),
  );
  nonnegative(input.remainingObjectLuxHours, "remainingObjectLuxHours");
  aligned(
    input.programPhaseLux,
    input.programHoursPerDisplayDay,
    "programPhaseLux",
  );
  if (sum(input.programHoursPerDisplayDay) > 24)
    simpleError(
      "hours",
      "A display-day lighting program cannot exceed 24 hours.",
    );
  const programLuxHoursPerDay = positive(
      input.programPhaseLux.reduce(
        (s, v, i) => s + v * input.programHoursPerDisplayDay[i],
        0,
      ),
      "dailyDose",
    ),
    maximumCompleteDisplayDays = count(
      Math.floor(input.remainingObjectLuxHours / programLuxHoursPerDay),
      "days",
    );
  return {
    programLuxHoursPerDay,
    maximumCompleteDisplayDays,
    residualLuxHours:
      input.remainingObjectLuxHours -
      maximumCompleteDisplayDays * programLuxHoursPerDay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  programPhaseLux: [50, 100],
  programHoursPerDisplayDay: [2, 3],
  remainingObjectLuxHours: 1000,
} satisfies Input;
export const exampleOutput = {
  programLuxHoursPerDay: 400,
  maximumCompleteDisplayDays: 2,
  residualLuxHours: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/exhibition-duration-lux-budget",
  title: "Exhibition Duration from Lux Budget Calculator",
  description:
    "Invert an explicitly mixed daily lighting program into complete budget-compatible display days, not a universal recommended exhibition duration.",
  inputs: inputFields,
  outputs: [
    {
      id: "programLuxHoursPerDay",
      label: "Program lux hours per day",
      kind: "number",
    },
    {
      id: "maximumCompleteDisplayDays",
      label: "Maximum complete display days",
      kind: "number",
    },
    { id: "residualLuxHours", label: "Residual lux hours", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      programPhaseLux: value.programPhaseLux as readonly number[],
      programHoursPerDisplayDay:
        value.programHoursPerDisplayDay as readonly number[],
      remainingObjectLuxHours: value.remainingObjectLuxHours as number,
    }),
});
export const run = tool.execute;
export default tool;
