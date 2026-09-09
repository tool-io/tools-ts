import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
  intervalUnion,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualCallerApprovedCareIntervalsMinutes: readonly (readonly number[])[];
  readonly actualCompleteReferencePeriodMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCallerApprovedCareIntervalsMinutes",
    label: "Actual caller approved care intervals minutes",
    kind: "matrix",
  },
  {
    id: "actualCompleteReferencePeriodMinutes",
    label: "Actual complete reference period minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualCompleteReferencePeriodMinutes, "period");
  if (
    input.actualCallerApprovedCareIntervalsMinutes.some(
      (r) =>
        r.length !== 2 ||
        r[0] < 0 ||
        r[1] > input.actualCompleteReferencePeriodMinutes,
    )
  )
    simpleError("intervals", "Actual intervalswithin declared period.");
  const m = sum(
    intervalUnion(input.actualCallerApprovedCareIntervalsMinutes).map(
      (r) => r[1] - r[0],
    ),
  );
  return {
    observedUnionCareMinutes: m,
    observedReferencePeriodCarePercent:
      (100 * m) / input.actualCompleteReferencePeriodMinutes,
    observedCareDayEquivalents: m / 1440,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCallerApprovedCareIntervalsMinutes: [
      [0, 60],
      [30, 90],
    ],
    actualCompleteReferencePeriodMinutes: 180,
  },
  output: {
    result: {
      observedUnionCareMinutes: 90,
      observedReferencePeriodCarePercent: 50,
      observedCareDayEquivalents: 0.0625,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/divorce-custody-time-percentage",
  title: "Custody Time Percentage Calculator",
  description:
    "Actual custody actual time percentage using union of overlapping approved intervals in same minuteaxis; halfopen intervals, day equivalents not legal overnight count. Actual order, custody attribution, timezone and guideline conventions external; not legal entitlement.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
