import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFactcheckRatingKeys: readonly string[];
  readonly callerVerifiedFactcheckRatingNotices: readonly string[];
  readonly queryFactcheckRatingKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFactcheckRatingKeys",
    label: "Caller verified factcheck rating keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFactcheckRatingNotices",
    label: "Caller verified factcheck rating notices",
    kind: "stringList",
  },
  {
    id: "queryFactcheckRatingKey",
    label: "Query factcheck rating key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFactcheckRatingKeys,
      input.callerVerifiedFactcheckRatingNotices,
      input.queryFactcheckRatingKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFactcheckRatingKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFactcheckRatingNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryFactcheckRatingKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/factcheck-claim-rating-scale-format-lookup",
  title: "Factcheck Claim Rating Scale Format Lookup",
  description:
    "Independently verified outlet/edition claim-rating definitions, not assign truth from wording or imply shared scales. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedFactcheckRatingKeys:
        value.callerVerifiedFactcheckRatingKeys as readonly string[],
      callerVerifiedFactcheckRatingNotices:
        value.callerVerifiedFactcheckRatingNotices as readonly string[],
      queryFactcheckRatingKey: value.queryFactcheckRatingKey as string,
    }),
});
export const run = tool.execute;
export default tool;
