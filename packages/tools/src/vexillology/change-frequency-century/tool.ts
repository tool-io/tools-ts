import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedChangeCount: number;
  readonly fullyObservedIntervalStartYear: number;
  readonly fullyObservedIntervalEndYearExclusive: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedChangeCount", label: "Observed change count", kind: "number" },
  {
    id: "fullyObservedIntervalStartYear",
    label: "Fully observed interval start year",
    kind: "number",
  },
  {
    id: "fullyObservedIntervalEndYearExclusive",
    label: "Fully observed interval end year exclusive",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.observedChangeCount, "events", 0, 1000000);
  bounded(input.fullyObservedIntervalStartYear, "start", 1, 9999);
  bounded(
    input.fullyObservedIntervalEndYearExclusive,
    "end",
    input.fullyObservedIntervalStartYear + 1,
    10000,
  );
  return {
    changesPerCentury:
      (100 * input.observedChangeCount) /
      (input.fullyObservedIntervalEndYearExclusive -
        input.fullyObservedIntervalStartYear),
    nominalExposureYears:
      input.fullyObservedIntervalEndYearExclusive -
      input.fullyObservedIntervalStartYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedChangeCount: 3,
    fullyObservedIntervalStartYear: 1900,
    fullyObservedIntervalEndYearExclusive: 2000,
  },
  output: { result: { changesPerCentury: 3, nominalExposureYears: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/change-frequency-century",
  title: "Flag Change Frequency per Century Estimator",
  description:
    "Change-event rate per100nominal calendar years within an independently fully observed half-open interval; events must be counted inside that interval. Not a forecast or uncertain historical completeness correction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
