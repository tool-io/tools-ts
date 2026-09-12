import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  sum,
  intervalUnion,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSameMedicationPossessionDayIntervals: readonly (readonly number[])[];
  readonly actualReferencePeriodDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSameMedicationPossessionDayIntervals",
    label: "Actual same medication possession day intervals",
    kind: "matrix",
  },
  {
    id: "actualReferencePeriodDays",
    label: "Actual reference period days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualReferencePeriodDays, "period", 1, 1000000);
  input.actualSameMedicationPossessionDayIntervals.forEach((r) => {
    if (r.length !== 2) simpleError("intervals", "Actualstart/enddaypair.");
    r.forEach((v) => bounded(v, "day", 0, input.actualReferencePeriodDays));
  });
  const d = sum(
    intervalUnion(input.actualSameMedicationPossessionDayIntervals).map(
      (r) => r[1] - r[0],
    ),
  );
  return {
    observedUnionCoveredDays: d,
    observedPdcFraction: d / input.actualReferencePeriodDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSameMedicationPossessionDayIntervals: [
      [0, 3],
      [2, 5],
    ],
    actualReferencePeriodDays: 10,
  },
  output: { result: { observedUnionCoveredDays: 5, observedPdcFraction: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/pdc-proportion-days-covered",
  title: "Proportion of Days Covered Calculator",
  description:
    "Actual independently qualified medication coverage half open whole-day interval UNION PDC, overlaps not double counted and within actual reference period. Not proof ingestion or prescription eligibility; carryovers witching/hospital policy externally resolved.",
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
