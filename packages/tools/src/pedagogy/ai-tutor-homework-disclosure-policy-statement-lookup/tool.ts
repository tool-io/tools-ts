import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAiDisclosureKeys: readonly string[];
  readonly callerVerifiedAiDisclosureNotices: readonly string[];
  readonly queryAiDisclosureKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAiDisclosureKeys",
    label: "Caller verified ai disclosure keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAiDisclosureNotices",
    label: "Caller verified ai disclosure notices",
    kind: "stringList",
  },
  {
    id: "queryAiDisclosureKey",
    label: "Query ai disclosure key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAiDisclosureKeys,
      input.callerVerifiedAiDisclosureNotices,
      input.queryAiDisclosureKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAiDisclosureKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedAiDisclosureNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryAiDisclosureKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/ai-tutor-homework-disclosure-policy-statement-lookup",
  title: "AI Tutor Homework Disclosure Policy Statement Lookup",
  description:
    "Query an independently verified course, institution and date-specific AI-assistance disclosure policy by exact key. Does not determine cheating or plagiarism, infer learner intent or supply current institutional rules.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedAiDisclosureKeys:
        value.callerVerifiedAiDisclosureKeys as readonly string[],
      callerVerifiedAiDisclosureNotices:
        value.callerVerifiedAiDisclosureNotices as readonly string[],
      queryAiDisclosureKey: value.queryAiDisclosureKey as string,
    }),
});
export const run = tool.execute;
export default tool;
