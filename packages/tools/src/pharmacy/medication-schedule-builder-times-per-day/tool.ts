import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerClinicianEstablishedAdministrationMinutesFromPeriodStart: readonly number[];
  readonly actualPeriodStartMinuteOnOneTimeline: number;
  readonly actualPeriodLengthMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerClinicianEstablishedAdministrationMinutesFromPeriodStart",
    label:
      "Caller clinician established administration minutes from period start",
    kind: "numberList",
  },
  {
    id: "actualPeriodStartMinuteOnOneTimeline",
    label: "Actual period start minute on one time line",
    kind: "number",
  },
  {
    id: "actualPeriodLengthMinutes",
    label: "Actual period length minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualPeriodLengthMinutes, "period");
  if (
    !input.callerClinicianEstablishedAdministrationMinutesFromPeriodStart
      .length ||
    input.callerClinicianEstablishedAdministrationMinutesFromPeriodStart.some(
      (v, i) =>
        v < 0 ||
        v >= input.actualPeriodLengthMinutes ||
        (i > 0 &&
          v <=
            input
              .callerClinicianEstablishedAdministrationMinutesFromPeriodStart[
              i - 1
            ]),
    )
  )
    simpleError(
      "times",
      "Actualorderedclinicianestablishedoffsetswithinperiod.",
    );
  return {
    recordedScheduledMinutesOnTimeline:
      input.callerClinicianEstablishedAdministrationMinutesFromPeriodStart.map(
        (v) => input.actualPeriodStartMinuteOnOneTimeline + v,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerClinicianEstablishedAdministrationMinutesFromPeriodStart: [0, 360],
    actualPeriodStartMinuteOnOneTimeline: 100,
    actualPeriodLengthMinutes: 1440,
  },
  output: { result: { recordedScheduledMinutesOnTimeline: [100, 460] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/medication-schedule-builder-times-per-day",
  title: "Times-Per-Day Schedule Builder",
  description:
    "Reformat an actual separately clinician-established within-day administration schedule onto explicit time line, no infer times from frequency, choose evenly spaced regimen or medication timing/safety.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
