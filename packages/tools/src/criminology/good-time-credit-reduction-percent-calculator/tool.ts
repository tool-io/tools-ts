import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSentenceDays: number;
  readonly independentlyAuthorizedGoodTimeDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedSentenceDays",
    label: "Caller verified sentence days",
    kind: "number",
  },
  {
    id: "independentlyAuthorizedGoodTimeDays",
    label: "Independently authorized good time days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerVerifiedSentenceDays, "sentence", 1, 1000000);
  bounded(
    input.independentlyAuthorizedGoodTimeDays,
    "credit",
    0,
    input.callerVerifiedSentenceDays,
  );
  return {
    conditionalRemainingSentenceDays:
      input.callerVerifiedSentenceDays -
      input.independentlyAuthorizedGoodTimeDays,
    authorizedGoodTimePercent:
      (100 * input.independentlyAuthorizedGoodTimeDays) /
      input.callerVerifiedSentenceDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSentenceDays: 100,
    independentlyAuthorizedGoodTimeDays: 15,
  },
  output: {
    result: {
      conditionalRemainingSentenceDays: 85,
      authorizedGoodTimePercent: 15,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/good-time-credit-reduction-percent-calculator",
  title: "Good Time Credit Sentence Reduction Percent Calculator",
  description:
    "Subtract independently legally authorized credited days from stated sentence under matched day convention. Does not determine eligibility, release date, earned-time law or a universal percentage.",
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
