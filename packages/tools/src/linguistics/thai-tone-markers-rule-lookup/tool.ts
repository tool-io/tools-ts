import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedThaiToneRuleKeys: readonly string[];
  readonly callerVerifiedThaiToneRuleNotices: readonly string[];
  readonly queryThaiToneRuleKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedThaiToneRuleKeys",
    label: "Caller verified thai tone rule keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedThaiToneRuleNotices",
    label: "Caller verified thai tone rule notices",
    kind: "stringList",
  },
  {
    id: "queryThaiToneRuleKey",
    label: "Query thai tone rule key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedThaiToneRuleKeys,
      input.callerVerifiedThaiToneRuleNotices,
      input.queryThaiToneRuleKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedThaiToneRuleKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedThaiToneRuleNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryThaiToneRuleKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/thai-tone-markers-rule-lookup",
  title: "Thai Tone Marker Rule Lookup",
  description:
    "Independently verified consonant-class/tone-mark/vowel-length/live-dead syllable conditioned Thai tone rule, no mark-only assignment. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedThaiToneRuleKeys:
        value.callerVerifiedThaiToneRuleKeys as readonly string[],
      callerVerifiedThaiToneRuleNotices:
        value.callerVerifiedThaiToneRuleNotices as readonly string[],
      queryThaiToneRuleKey: value.queryThaiToneRuleKey as string,
    }),
});
export const run = tool.execute;
export default tool;
