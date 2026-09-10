import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyVerifiedCaffeineMgByServing: readonly number[];
  readonly callerClinicallyApplicableDailyReviewLimitMg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedCaffeineMgByServing",
    label: "Independently verified caffeine mg by serving",
    kind: "numberList",
  },
  {
    id: "callerClinicallyApplicableDailyReviewLimitMg",
    label: "Caller clinically applicable daily review limit mg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.independentlyVerifiedCaffeineMgByServing.forEach((v) =>
    nonnegative(v, "caffeine"),
  );
  nonnegative(
    input.callerClinicallyApplicableDailyReviewLimitMg,
    "reviewlimit",
  );
  const t = sum(input.independentlyVerifiedCaffeineMgByServing);
  return {
    observedCaffeineMg: t,
    signedReviewLimitMarginMg:
      input.callerClinicallyApplicableDailyReviewLimitMg - t,
    exceedsCallerReviewLimit:
      t > input.callerClinicallyApplicableDailyReviewLimitMg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedCaffeineMgByServing: [50, 75],
    callerClinicallyApplicableDailyReviewLimitMg: 200,
  },
  output: {
    result: {
      observedCaffeineMg: 125,
      signedReviewLimitMarginMg: 75,
      exceedsCallerReviewLimit: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/caffeine-limit-checker",
  title: "Caffeine Limit Checker",
  description:
    "Actual distinct consumed-serving caffeine inventory versus independently applicable clinical review limit. Not certify safety, identify hidden caffeine, universal dose limit or permit exposure below a threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
