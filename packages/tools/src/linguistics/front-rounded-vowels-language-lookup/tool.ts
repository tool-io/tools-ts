import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFrontRoundedVowelKeys: readonly string[];
  readonly callerVerifiedFrontRoundedVowelNotices: readonly string[];
  readonly queryFrontRoundedVowelKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFrontRoundedVowelKeys",
    label: "Caller verified front rounded vowel keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFrontRoundedVowelNotices",
    label: "Caller verified front rounded vowel notices",
    kind: "stringList",
  },
  {
    id: "queryFrontRoundedVowelKey",
    label: "Query front rounded vowel key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFrontRoundedVowelKeys,
      input.callerVerifiedFrontRoundedVowelNotices,
      input.queryFrontRoundedVowelKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFrontRoundedVowelKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFrontRoundedVowelNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryFrontRoundedVowelKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/front-rounded-vowels-language-lookup",
  title: "Front Rounded Vowels Language Lookup",
  description:
    "Caller independently documented front-rounded vowel inventory reference, not script diacritic assumption. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedFrontRoundedVowelKeys:
        value.callerVerifiedFrontRoundedVowelKeys as readonly string[],
      callerVerifiedFrontRoundedVowelNotices:
        value.callerVerifiedFrontRoundedVowelNotices as readonly string[],
      queryFrontRoundedVowelKey: value.queryFrontRoundedVowelKey as string,
    }),
});
export const run = tool.execute;
export default tool;
