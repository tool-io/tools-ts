import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  dateDay,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly exposedSubscriberCohortIds: readonly string[];
  readonly priceIncreaseEffectiveDate: string;
  readonly callerExclusiveObservationEndDate: string;
  readonly observedCancellationDatesOrEmpty: readonly string[];
}>;
export type Output = Readonly<{
  readonly withinWindowCancelledSubscriberIds: readonly string[];
  readonly observedCohortChurnPercent: number;
  readonly cohortSize: number;
}>;
const inputFields = [
  {
    id: "exposedSubscriberCohortIds",
    label: "Exposed subscriber cohort ids",
    kind: "stringList",
  },
  {
    id: "priceIncreaseEffectiveDate",
    label: "Price increase effective date",
    kind: "string",
  },
  {
    id: "callerExclusiveObservationEndDate",
    label: "Caller exclusive observation end date",
    kind: "string",
  },
  {
    id: "observedCancellationDatesOrEmpty",
    label: "Observed cancellation dates or empty",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.exposedSubscriberCohortIds,
    input.observedCancellationDatesOrEmpty,
    "exposedSubscriberCohortIds",
  );
  unique(input.exposedSubscriberCohortIds, "cohort");
  const start = dateDay(input.priceIncreaseEffectiveDate),
    end = dateDay(input.callerExclusiveObservationEndDate);
  if (end <= start)
    simpleError("window", "Positive caller observation window required.");
  const ids = input.exposedSubscriberCohortIds.filter((_, i) => {
    const value = input.observedCancellationDatesOrEmpty[i];
    if (!value) return false;
    const d = dateDay(value);
    return d >= start && d < end;
  });
  return {
    withinWindowCancelledSubscriberIds: ids,
    observedCohortChurnPercent:
      (100 * ids.length) / input.exposedSubscriberCohortIds.length,
    cohortSize: input.exposedSubscriberCohortIds.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  exposedSubscriberCohortIds: ["a", "b", "c"],
  priceIncreaseEffectiveDate: "2025-01-01",
  callerExclusiveObservationEndDate: "2025-02-01",
  observedCancellationDatesOrEmpty: ["2025-01-10", "", "2025-02-01"],
} satisfies Input;
export const exampleOutput = {
  withinWindowCancelledSubscriberIds: ["a"],
  observedCohortChurnPercent: 33.333333333333336,
  cohortSize: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/subscription-churn-after-price-rise-percent",
  title: "Subscription Churn After Price Rise Percent",
  description:
    "Audit observed cancellation dates in a fixed caller exposed cohort and explicit post-price window; no subscriber additions denominator, causal attribution to price rise, complete follow-up guarantee or predicted future churn.",
  inputs: inputFields,
  outputs: [
    {
      id: "withinWindowCancelledSubscriberIds",
      label: "Within window cancelled subscriber ids",
      kind: "stringList",
    },
    {
      id: "observedCohortChurnPercent",
      label: "Observed cohort churn percent",
      kind: "number",
    },
    { id: "cohortSize", label: "Cohort size", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      exposedSubscriberCohortIds:
        value.exposedSubscriberCohortIds as readonly string[],
      priceIncreaseEffectiveDate: value.priceIncreaseEffectiveDate as string,
      callerExclusiveObservationEndDate:
        value.callerExclusiveObservationEndDate as string,
      observedCancellationDatesOrEmpty:
        value.observedCancellationDatesOrEmpty as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
