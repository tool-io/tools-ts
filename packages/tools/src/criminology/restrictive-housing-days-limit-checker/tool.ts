import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyObservedRestrictiveHousingDays: number;
  readonly callerApplicableReviewLimitDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyObservedRestrictiveHousingDays",
    label: "Independently observed restrictive housing days",
    kind: "number",
  },
  {
    id: "callerApplicableReviewLimitDays",
    label: "Caller applicable review limit days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyObservedRestrictiveHousingDays, "days");
  nonnegative(input.callerApplicableReviewLimitDays, "limit");
  return {
    signedRemainingReviewMarginDays:
      input.callerApplicableReviewLimitDays -
      input.independentlyObservedRestrictiveHousingDays,
    exceedsCallerReviewLimit:
      input.independentlyObservedRestrictiveHousingDays >
      input.callerApplicableReviewLimitDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedRestrictiveHousingDays: 10,
    callerApplicableReviewLimitDays: 15,
  },
  output: {
    result: {
      signedRemainingReviewMarginDays: 5,
      exceedsCallerReviewLimit: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/restrictive-housing-days-limit-checker",
  title: "Restrictive Housing Days Limit Checker",
  description:
    "Compare actual restrictive-housing exposure with caller independently applicable review limit only. Not approve conditions, lawfulness or human-rights compliance below the threshold.",
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
