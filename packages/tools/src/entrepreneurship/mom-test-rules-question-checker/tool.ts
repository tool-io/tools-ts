import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerAnnotatedQuestionIds: readonly string[];
  readonly askedAboutSpecificPastBehaviorFlags: readonly number[];
  readonly containsLeadingComplimentPromptFlags: readonly number[];
  readonly requestsHypotheticalPurchaseFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerInterviewQuestionReviewIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerAnnotatedQuestionIds",
    label: "Caller annotated question ids",
    kind: "stringList",
  },
  {
    id: "askedAboutSpecificPastBehaviorFlags",
    label: "Asked about specific past behavior flags",
    kind: "numberList",
  },
  {
    id: "containsLeadingComplimentPromptFlags",
    label: "Contains leading compliment prompt flags",
    kind: "numberList",
  },
  {
    id: "requestsHypotheticalPurchaseFlags",
    label: "Requests hypothetical purchase flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.askedAboutSpecificPastBehaviorFlags,
    "askedAboutSpecificPastBehaviorFlags",
  );
  binary(
    input.containsLeadingComplimentPromptFlags,
    "containsLeadingComplimentPromptFlags",
  );
  binary(
    input.requestsHypotheticalPurchaseFlags,
    "requestsHypotheticalPurchaseFlags",
  );
  aligned(
    input.callerAnnotatedQuestionIds,
    input.askedAboutSpecificPastBehaviorFlags,
    "callerAnnotatedQuestionIds",
  );
  aligned(
    input.callerAnnotatedQuestionIds,
    input.containsLeadingComplimentPromptFlags,
    "callerAnnotatedQuestionIds",
  );
  aligned(
    input.callerAnnotatedQuestionIds,
    input.requestsHypotheticalPurchaseFlags,
    "callerAnnotatedQuestionIds",
  );
  unique(input.callerAnnotatedQuestionIds, "questions");
  return {
    callerInterviewQuestionReviewIds: input.callerAnnotatedQuestionIds.filter(
      (_, i) =>
        !input.askedAboutSpecificPastBehaviorFlags[i] ||
        input.containsLeadingComplimentPromptFlags[i] ||
        input.requestsHypotheticalPurchaseFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAnnotatedQuestionIds: ["q1", "q2"],
  askedAboutSpecificPastBehaviorFlags: [1, 0],
  containsLeadingComplimentPromptFlags: [0, 1],
  requestsHypotheticalPurchaseFlags: [0, 1],
} satisfies Input;
export const exampleOutput = {
  callerInterviewQuestionReviewIds: ["q2"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/mom-test-rules-question-checker",
  title: "Mom Test Rules Question Checker",
  description:
    "Audit independently annotated MomTest-style question features; past-behavior vs hypothetical/leading prompts, not automatic NLP intent or interview validity. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerInterviewQuestionReviewIds",
      label: "Caller interview question review ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAnnotatedQuestionIds:
        value.callerAnnotatedQuestionIds as readonly string[],
      askedAboutSpecificPastBehaviorFlags:
        value.askedAboutSpecificPastBehaviorFlags as readonly number[],
      containsLeadingComplimentPromptFlags:
        value.containsLeadingComplimentPromptFlags as readonly number[],
      requestsHypotheticalPurchaseFlags:
        value.requestsHypotheticalPurchaseFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
