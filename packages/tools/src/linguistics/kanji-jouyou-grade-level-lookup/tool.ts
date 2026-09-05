import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedJouyouGradeKeys: readonly string[];
  readonly callerVerifiedJouyouGradeNotices: readonly string[];
  readonly queryJouyouGradeKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedJouyouGradeKeys",
    label: "Caller verified jouyou grade keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedJouyouGradeNotices",
    label: "Caller verified jouyou grade notices",
    kind: "stringList",
  },
  {
    id: "queryJouyouGradeKey",
    label: "Query jouyou grade key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedJouyouGradeKeys,
      input.callerVerifiedJouyouGradeNotices,
      input.queryJouyouGradeKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedJouyouGradeKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedJouyouGradeNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryJouyouGradeKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/kanji-jouyou-grade-level-lookup",
  title: "Kanji Jōyō Grade Level Lookup",
  description:
    "Independently verified Japanese character/curriculum edition school-grade or unassigned record. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedJouyouGradeKeys:
        value.callerVerifiedJouyouGradeKeys as readonly string[],
      callerVerifiedJouyouGradeNotices:
        value.callerVerifiedJouyouGradeNotices as readonly string[],
      queryJouyouGradeKey: value.queryJouyouGradeKey as string,
    }),
});
export const run = tool.execute;
export default tool;
