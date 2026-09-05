import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedStrongVerbAblautKeys: readonly string[];
  readonly callerVerifiedStrongVerbAblautNotices: readonly string[];
  readonly queryStrongVerbAblautKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedStrongVerbAblautKeys",
    label: "Caller verified strong verb ablaut keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedStrongVerbAblautNotices",
    label: "Caller verified strong verb ablaut notices",
    kind: "stringList",
  },
  {
    id: "queryStrongVerbAblautKey",
    label: "Query strong verb ablaut key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedStrongVerbAblautKeys,
      input.callerVerifiedStrongVerbAblautNotices,
      input.queryStrongVerbAblautKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedStrongVerbAblautKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedStrongVerbAblautNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryStrongVerbAblautKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/strong-verbs-germanic-ablaut-pattern-lookup",
  title: "Germanic Strong Verb Ablaut Pattern Lookup",
  description:
    "Independently verified Germanic verb/class/variety ablaut paradigm, not generated conjugation of unseen verbs. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedStrongVerbAblautKeys:
        value.callerVerifiedStrongVerbAblautKeys as readonly string[],
      callerVerifiedStrongVerbAblautNotices:
        value.callerVerifiedStrongVerbAblautNotices as readonly string[],
      queryStrongVerbAblautKey: value.queryStrongVerbAblautKey as string,
    }),
});
export const run = tool.execute;
export default tool;
