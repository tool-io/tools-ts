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
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly outboundTravelHours: number;
  readonly installationHours: number;
  readonly requiredObservationHours: number;
  readonly returnTravelHours: number;
  readonly callerMaximumDutyHoursPerDay: number;
}>;
export type Output = Readonly<{
  readonly totalModeledCourierDutyHours: number;
  readonly minimumWholeDutyDays: number;
  readonly lastDayUnusedDutyHours: number;
}>;
const inputFields = [
  { id: "outboundTravelHours", label: "Outbound travel hours", kind: "number" },
  { id: "installationHours", label: "Installation hours", kind: "number" },
  {
    id: "requiredObservationHours",
    label: "Required observation hours",
    kind: "number",
  },
  { id: "returnTravelHours", label: "Return travel hours", kind: "number" },
  {
    id: "callerMaximumDutyHoursPerDay",
    label: "Caller maximum duty hours per day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMaximumDutyHoursPerDay, "callerMaximumDutyHoursPerDay");
  nonnegative(input.outboundTravelHours, "outboundTravelHours");
  nonnegative(input.installationHours, "installationHours");
  nonnegative(input.requiredObservationHours, "requiredObservationHours");
  nonnegative(input.returnTravelHours, "returnTravelHours");
  if (input.callerMaximumDutyHoursPerDay > 24)
    simpleError("duty", "Caller daily duty ceiling at most 24h.");
  const h =
      input.outboundTravelHours +
      input.installationHours +
      input.requiredObservationHours +
      input.returnTravelHours,
    n = safeCeil(h / input.callerMaximumDutyHoursPerDay, "days");
  return {
    totalModeledCourierDutyHours: h,
    minimumWholeDutyDays: n,
    lastDayUnusedDutyHours: n * input.callerMaximumDutyHoursPerDay - h,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  outboundTravelHours: 5,
  installationHours: 4,
  requiredObservationHours: 2,
  returnTravelHours: 5,
  callerMaximumDutyHoursPerDay: 8,
} satisfies Input;
export const exampleOutput = {
  totalModeledCourierDutyHours: 16,
  minimumWholeDutyDays: 2,
  lastDayUnusedDutyHours: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/courier-day-roundtrip-duration",
  title: "Courier Day Round Trip Duration Calculator",
  description:
    "Budget divisible courier duty-hour components under explicit caller day ceiling; ignores travel connections, time zones and indivisible tasks, not a guaranteed itinerary or lawful/safe duty schedule.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalModeledCourierDutyHours",
      label: "Total modeled courier duty hours",
      kind: "number",
    },
    {
      id: "minimumWholeDutyDays",
      label: "Minimum whole duty days",
      kind: "number",
    },
    {
      id: "lastDayUnusedDutyHours",
      label: "Last day unused duty hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      outboundTravelHours: value.outboundTravelHours as number,
      installationHours: value.installationHours as number,
      requiredObservationHours: value.requiredObservationHours as number,
      returnTravelHours: value.returnTravelHours as number,
      callerMaximumDutyHoursPerDay:
        value.callerMaximumDutyHoursPerDay as number,
    }),
});
export const run = tool.execute;
export default tool;
