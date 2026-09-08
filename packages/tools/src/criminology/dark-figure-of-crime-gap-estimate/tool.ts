import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerMatchedSurveyEstimatedEvents: number;
  readonly matchedRecordedEvents: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMatchedSurveyEstimatedEvents",
    label: "Caller matched survey estimated events",
    kind: "number",
  },
  {
    id: "matchedRecordedEvents",
    label: "Matched recorded events",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerMatchedSurveyEstimatedEvents, "estimate");
  nonnegative(input.matchedRecordedEvents, "recorded");
  return {
    signedUnrecordedEventGap:
      input.callerMatchedSurveyEstimatedEvents - input.matchedRecordedEvents,
    conditionalUnrecordedFraction:
      1 -
      input.matchedRecordedEvents / input.callerMatchedSurveyEstimatedEvents,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerMatchedSurveyEstimatedEvents: 100, matchedRecordedEvents: 60 },
  output: {
    result: {
      signedUnrecordedEventGap: 40,
      conditionalUnrecordedFraction: 0.4,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/dark-figure-of-crime-gap-estimate",
  title: "Dark Figure Of Crime Gap Estimate Calculator",
  description:
    "Matched survey-estimated versus recorded event gap with independently harmonized incident definitions, population and period. Negative discrepancies retained; no inferred actual crime count, precise dark-figure estimate or causal reporting bias.",
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
