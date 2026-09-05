import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTenseAspectKeys: readonly string[];
  readonly callerVerifiedTenseAspectNotices: readonly string[];
  readonly queryTenseAspectKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedTenseAspectKeys",
    label: "Caller verified tense aspect keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTenseAspectNotices",
    label: "Caller verified tense aspect notices",
    kind: "stringList",
  },
  {
    id: "queryTenseAspectKey",
    label: "Query tense aspect key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedTenseAspectKeys,
      input.callerVerifiedTenseAspectNotices,
      input.queryTenseAspectKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTenseAspectKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedTenseAspectNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryTenseAspectKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/tense-aspect-system-lookup-by-language",
  title: "Tense-Aspect System By Language Lookup",
  description:
    "Independently verified variety/construction tense-aspect system record, not English category projection. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedTenseAspectKeys:
        value.callerVerifiedTenseAspectKeys as readonly string[],
      callerVerifiedTenseAspectNotices:
        value.callerVerifiedTenseAspectNotices as readonly string[],
      queryTenseAspectKey: value.queryTenseAspectKey as string,
    }),
});
export const run = tool.execute;
export default tool;
