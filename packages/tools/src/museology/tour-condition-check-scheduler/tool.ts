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
  count,
  aligned,
  sum,
  span,
} from "../shared.js";
export type Input = Readonly<{
  readonly stopArrivalOrdinals: readonly number[];
  readonly stopDepartureOrdinals: readonly number[];
  readonly callerCheckEveryDays: number;
  readonly requireDepartureCheck: boolean;
}>;
export type Output = Readonly<{
  readonly checkOrdinalsByStop: readonly (readonly number[])[];
  readonly totalScheduledCheckCount: number;
}>;
const inputFields = [
  {
    id: "stopArrivalOrdinals",
    label: "Stop arrival ordinals",
    kind: "numberList",
  },
  {
    id: "stopDepartureOrdinals",
    label: "Stop departure ordinals",
    kind: "numberList",
  },
  {
    id: "callerCheckEveryDays",
    label: "Caller check every days",
    kind: "integer",
  },
  {
    id: "requireDepartureCheck",
    label: "Require departure check",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerCheckEveryDays, "callerCheckEveryDays");
  input.stopArrivalOrdinals.forEach((v) => count(v, "stopArrivalOrdinals"));
  input.stopDepartureOrdinals.forEach((v) => count(v, "stopDepartureOrdinals"));
  count(input.callerCheckEveryDays, "callerCheckEveryDays");
  aligned(
    input.stopArrivalOrdinals,
    input.stopDepartureOrdinals,
    "stopArrivalOrdinals",
  );
  const counts = input.stopArrivalOrdinals.map((v, i) =>
    count(
      Math.floor(
        span(v, input.stopDepartureOrdinals[i], "stop") /
          input.callerCheckEveryDays,
      ) + 1,
      "checks",
    ),
  );
  if (sum(counts) + input.stopArrivalOrdinals.length > 100000)
    simpleError("checks", "Bounded total generated checks required.");
  if (
    counts.length > 128 ||
    counts.some(
      (n, i) =>
        n +
          (input.requireDepartureCheck &&
          (input.stopDepartureOrdinals[i] - input.stopArrivalOrdinals[i]) %
            input.callerCheckEveryDays !==
            0
            ? 1
            : 0) >
        128,
    )
  )
    simpleError("checks", "At most 128 stops/checks per stop.");
  const rows = input.stopArrivalOrdinals.map((v, i) => {
    const r = Array.from(
      { length: counts[i] },
      (_, j) => v + j * input.callerCheckEveryDays,
    );
    if (
      input.requireDepartureCheck &&
      r.at(-1) !== input.stopDepartureOrdinals[i]
    )
      r.push(input.stopDepartureOrdinals[i]);
    return r;
  });
  if (rows.length > 128 || rows.some((r) => r.length > 128))
    simpleError("checks", "At most 128 stops/checks per stop.");
  return {
    checkOrdinalsByStop: rows,
    totalScheduledCheckCount: sum(rows.map((r) => r.length)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stopArrivalOrdinals: [10, 20],
  stopDepartureOrdinals: [15, 25],
  callerCheckEveryDays: 3,
  requireDepartureCheck: true,
} satisfies Input;
export const exampleOutput = {
  checkOrdinalsByStop: [
    [10, 13, 15],
    [20, 23, 25],
  ],
  totalScheduledCheckCount: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/tour-condition-check-scheduler",
  title: "Condition Check Interval During Tour Stops Scheduler",
  description:
    "Plan arrival/periodic/optional departure checks on caller tour-stop ordinal windows, without duplicate coincident departure checks or conservation completeness guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "checkOrdinalsByStop",
      label: "Check ordinals by stop",
      kind: "matrix",
    },
    {
      id: "totalScheduledCheckCount",
      label: "Total scheduled check count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stopArrivalOrdinals: value.stopArrivalOrdinals as readonly number[],
      stopDepartureOrdinals: value.stopDepartureOrdinals as readonly number[],
      callerCheckEveryDays: value.callerCheckEveryDays as number,
      requireDepartureCheck: value.requireDepartureCheck as boolean,
    }),
});
export const run = tool.execute;
export default tool;
