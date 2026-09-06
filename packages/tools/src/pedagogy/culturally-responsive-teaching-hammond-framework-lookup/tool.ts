import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedResponsiveTeachingKeys: readonly string[];
  readonly callerVerifiedResponsiveTeachingNotices: readonly string[];
  readonly queryResponsiveTeachingKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedResponsiveTeachingKeys",
    label: "Caller verified responsive teaching keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedResponsiveTeachingNotices",
    label: "Caller verified responsive teaching notices",
    kind: "stringList",
  },
  {
    id: "queryResponsiveTeachingKey",
    label: "Query responsive teaching key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedResponsiveTeachingKeys,
      input.callerVerifiedResponsiveTeachingNotices,
      input.queryResponsiveTeachingKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedResponsiveTeachingKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedResponsiveTeachingNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryResponsiveTeachingKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/culturally-responsive-teaching-hammond-framework-lookup",
  title: "Culturally Responsive Teaching Hammond Framework Lookup",
  description:
    "Caller independently source/edition/context-verified Hammond culturally responsive teaching framework reference, not cultural identity inference. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
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
      callerVerifiedResponsiveTeachingKeys:
        value.callerVerifiedResponsiveTeachingKeys as readonly string[],
      callerVerifiedResponsiveTeachingNotices:
        value.callerVerifiedResponsiveTeachingNotices as readonly string[],
      queryResponsiveTeachingKey: value.queryResponsiveTeachingKey as string,
    }),
});
export const run = tool.execute;
export default tool;
