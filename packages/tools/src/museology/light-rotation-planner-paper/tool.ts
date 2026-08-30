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
} from "../shared.js";
export type Input = Readonly<{
  readonly remainingLuxHoursByWork: readonly number[];
  readonly plannedDisplayLuxByWork: readonly number[];
  readonly displayHoursPerDay: number;
  readonly callerRotationBlockDays: number;
}>;
export type Output = Readonly<{
  readonly maximumCompleteRotationBlocksByWork: readonly number[];
  readonly unusedLuxHoursByWork: readonly number[];
}>;
const inputFields = [
  {
    id: "remainingLuxHoursByWork",
    label: "Remaining lux hours by work",
    kind: "numberList",
  },
  {
    id: "plannedDisplayLuxByWork",
    label: "Planned display lux by work",
    kind: "numberList",
  },
  { id: "displayHoursPerDay", label: "Display hours per day", kind: "number" },
  {
    id: "callerRotationBlockDays",
    label: "Caller rotation block days",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.plannedDisplayLuxByWork.forEach((v) =>
    positive(v, "plannedDisplayLuxByWork"),
  );
  positive(input.displayHoursPerDay, "displayHoursPerDay");
  positive(input.callerRotationBlockDays, "callerRotationBlockDays");
  input.remainingLuxHoursByWork.forEach((v) =>
    nonnegative(v, "remainingLuxHoursByWork"),
  );
  count(input.callerRotationBlockDays, "callerRotationBlockDays");
  aligned(
    input.remainingLuxHoursByWork,
    input.plannedDisplayLuxByWork,
    "remainingLuxHoursByWork",
  );
  if (input.displayHoursPerDay > 24)
    simpleError("hours", "At most 24 display hours per day.");
  const dose = input.plannedDisplayLuxByWork.map(
      (v) => v * input.displayHoursPerDay * input.callerRotationBlockDays,
    ),
    n = dose.map((v, i) =>
      count(Math.floor(input.remainingLuxHoursByWork[i] / v), "blocks"),
    );
  return {
    maximumCompleteRotationBlocksByWork: n,
    unusedLuxHoursByWork: n.map(
      (v, i) => input.remainingLuxHoursByWork[i] - v * dose[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  remainingLuxHoursByWork: [1000, 2000],
  plannedDisplayLuxByWork: [50, 100],
  displayHoursPerDay: 10,
  callerRotationBlockDays: 3,
} satisfies Input;
export const exampleOutput = {
  maximumCompleteRotationBlocksByWork: [0, 0],
  unusedLuxHoursByWork: [1000, 2000],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/light-rotation-planner-paper",
  title: "Light Rotation Schedule Interval Planner for Works on Paper",
  description:
    "Fit whole caller rotation blocks independently across works with different remaining light ledgers/illuminance; no recovery of prior fading during dark rotation.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumCompleteRotationBlocksByWork",
      label: "Maximum complete rotation blocks by work",
      kind: "numberList",
    },
    {
      id: "unusedLuxHoursByWork",
      label: "Unused lux hours by work",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      remainingLuxHoursByWork:
        value.remainingLuxHoursByWork as readonly number[],
      plannedDisplayLuxByWork:
        value.plannedDisplayLuxByWork as readonly number[],
      displayHoursPerDay: value.displayHoursPerDay as number,
      callerRotationBlockDays: value.callerRotationBlockDays as number,
    }),
});
export const run = tool.execute;
export default tool;
