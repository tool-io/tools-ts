import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  rearrestSurvival,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyObservedFollowupTimes: readonly number[];
  readonly independentlyVerifiedRearrestEventFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyObservedFollowupTimes",
    label: "Independently observed followup times",
    kind: "numberList",
  },
  {
    id: "independentlyVerifiedRearrestEventFlags",
    label: "Independently verified rearrest event flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyObservedFollowupTimes,
    input.independentlyVerifiedRearrestEventFlags,
    "cohort",
  );
  input.independentlyObservedFollowupTimes.forEach((v) =>
    nonnegative(v, "time"),
  );
  binary(input.independentlyVerifiedRearrestEventFlags, "events");
  const table = rearrestSurvival({
      times: input.independentlyObservedFollowupTimes,
      events: input.independentlyVerifiedRearrestEventFlags,
    }).survivalTable,
    q = [0.75, 0.5, 0.25].map((p) => table.find((r) => r[1] <= p)?.[0] ?? -1);
  return {
    observedProductLimitQuartileTimes: q,
    quartileReachedFlags: q.map((v) => (v >= 0 ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedFollowupTimes: [1, 2, 3, 4],
    independentlyVerifiedRearrestEventFlags: [1, 1, 1, 1],
  },
  output: {
    result: {
      observedProductLimitQuartileTimes: [1, 2, 3],
      quartileReachedFlags: [1, 1, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/time-to-rearrest-survival-quartile-estimate",
  title: "Time To Rearrest Survival Quartile Estimator",
  description:
    "Invert existing Kaplan-Meier product-limit steps to actual rearrest cohort 25/50/75 percent event quantile times, retaining unreached\u22121and censoring. Event/censor ties use existing estimator; not an individual risk forecast or treat rearrest as conviction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
