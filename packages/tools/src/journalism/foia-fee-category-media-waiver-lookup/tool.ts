import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFoiaFeesKeys: readonly string[];
  readonly callerVerifiedFoiaFeesNotices: readonly string[];
  readonly queryFoiaFeesKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFoiaFeesKeys",
    label: "Caller verified foia fees keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFoiaFeesNotices",
    label: "Caller verified foia fees notices",
    kind: "stringList",
  },
  { id: "queryFoiaFeesKey", label: "Query foia fees key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFoiaFeesKeys,
      input.callerVerifiedFoiaFeesNotices,
      input.queryFoiaFeesKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFoiaFeesKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedFoiaFeesNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryFoiaFeesKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/foia-fee-category-media-waiver-lookup",
  title: "FOIA Fee Category Media Waiver Lookup",
  description:
    "Independently verified agency/date requester classification/fee waiver standards, no automatic media entitlement. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedFoiaFeesKeys:
        value.callerVerifiedFoiaFeesKeys as readonly string[],
      callerVerifiedFoiaFeesNotices:
        value.callerVerifiedFoiaFeesNotices as readonly string[],
      queryFoiaFeesKey: value.queryFoiaFeesKey as string,
    }),
});
export const run = tool.execute;
export default tool;
