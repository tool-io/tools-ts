import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualInitialResponseFraction: number;
  readonly callerConditionalFollowUpResponseFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInitialResponseFraction",
    label: "Actual initial response fraction",
    kind: "number",
  },
  {
    id: "callerConditionalFollowUpResponseFraction",
    label: "Caller conditional follow up response fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(
    input.actualInitialResponseFraction,
    "actualInitialResponseFraction",
  );
  fraction(
    input.callerConditionalFollowUpResponseFraction,
    "callerConditionalFollowUpResponseFraction",
  );
  return {
    value:
      input.actualInitialResponseFraction +
      (1 - input.actualInitialResponseFraction) *
        input.callerConditionalFollowUpResponseFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInitialResponseFraction: 0.5,
    callerConditionalFollowUpResponseFraction: 0.5,
  },
  output: { result: { value: 0.75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/response-rate-follow-up-mailing-estimate",
  title: "Follow-Up Mailing Response Rate Estimate",
  description:
    "Conditional initial response plus remaining non respondent fraction\u00d7independently established conditional follow up response, no count double claim or guaranteed mail efficacy. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
