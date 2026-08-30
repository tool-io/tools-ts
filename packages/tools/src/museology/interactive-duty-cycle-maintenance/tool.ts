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
  readonly visitorActivationsPerDay: number;
  readonly secondsActivePerActivation: number;
  readonly backgroundActiveHoursPerDay: number;
  readonly remainingServiceActiveHours: number;
}>;
export type Output = Readonly<{
  readonly modeledActiveHoursPerDay: number;
  readonly maximumCompleteDaysBeforeActiveHourService: number;
  readonly remainingActiveHoursAfterCompleteDays: number;
}>;
const inputFields = [
  {
    id: "visitorActivationsPerDay",
    label: "Visitor activations per day",
    kind: "integer",
  },
  {
    id: "secondsActivePerActivation",
    label: "Seconds active per activation",
    kind: "number",
  },
  {
    id: "backgroundActiveHoursPerDay",
    label: "Background active hours per day",
    kind: "number",
  },
  {
    id: "remainingServiceActiveHours",
    label: "Remaining service active hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.visitorActivationsPerDay, "visitorActivationsPerDay");
  nonnegative(input.secondsActivePerActivation, "secondsActivePerActivation");
  nonnegative(input.backgroundActiveHoursPerDay, "backgroundActiveHoursPerDay");
  nonnegative(input.remainingServiceActiveHours, "remainingServiceActiveHours");
  count(input.visitorActivationsPerDay, "visitorActivationsPerDay");
  const h = positive(
    (input.visitorActivationsPerDay * input.secondsActivePerActivation) / 3600 +
      input.backgroundActiveHoursPerDay,
    "activeHours",
  );
  if (h > 24)
    simpleError(
      "hours",
      "Nonoverlapping active hours per day cannot exceed 24.",
    );
  const n = count(Math.floor(input.remainingServiceActiveHours / h), "days");
  return {
    modeledActiveHoursPerDay: h,
    maximumCompleteDaysBeforeActiveHourService: n,
    remainingActiveHoursAfterCompleteDays:
      input.remainingServiceActiveHours - n * h,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  visitorActivationsPerDay: 100,
  secondsActivePerActivation: 60,
  backgroundActiveHoursPerDay: 1,
  remainingServiceActiveHours: 30,
} satisfies Input;
export const exampleOutput = {
  modeledActiveHoursPerDay: 2.6666666666666665,
  maximumCompleteDaysBeforeActiveHourService: 11,
  remainingActiveHoursAfterCompleteDays: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/interactive-duty-cycle-maintenance",
  title: "Interactive Exhibit Duty Cycle Maintenance Interval Calculator",
  description:
    "Budget active-time maintenance exposure from visitor activations plus background operation, not calendar-only age or a validated failure/maintenance interval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledActiveHoursPerDay",
      label: "Modeled active hours per day",
      kind: "number",
    },
    {
      id: "maximumCompleteDaysBeforeActiveHourService",
      label: "Maximum complete days before active hour service",
      kind: "number",
    },
    {
      id: "remainingActiveHoursAfterCompleteDays",
      label: "Remaining active hours after complete days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      visitorActivationsPerDay: value.visitorActivationsPerDay as number,
      secondsActivePerActivation: value.secondsActivePerActivation as number,
      backgroundActiveHoursPerDay: value.backgroundActiveHoursPerDay as number,
      remainingServiceActiveHours: value.remainingServiceActiveHours as number,
    }),
});
export const run = tool.execute;
export default tool;
