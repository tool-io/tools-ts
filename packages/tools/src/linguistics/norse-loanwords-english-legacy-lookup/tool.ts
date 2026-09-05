import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedNorseEnglishLegacyKeys: readonly string[];
  readonly callerVerifiedNorseEnglishLegacyNotices: readonly string[];
  readonly queryNorseEnglishLegacyKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedNorseEnglishLegacyKeys",
    label: "Caller verified norse english legacy keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedNorseEnglishLegacyNotices",
    label: "Caller verified norse english legacy notices",
    kind: "stringList",
  },
  {
    id: "queryNorseEnglishLegacyKey",
    label: "Query norse english legacy key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedNorseEnglishLegacyKeys,
      input.callerVerifiedNorseEnglishLegacyNotices,
      input.queryNorseEnglishLegacyKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedNorseEnglishLegacyKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedNorseEnglishLegacyNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryNorseEnglishLegacyKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/norse-loanwords-english-legacy-lookup",
  title: "Norse Loanwords in English Legacy Lookup",
  description:
    "Independently verified English lexeme/sense Norse contact etymology reference. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedNorseEnglishLegacyKeys:
        value.callerVerifiedNorseEnglishLegacyKeys as readonly string[],
      callerVerifiedNorseEnglishLegacyNotices:
        value.callerVerifiedNorseEnglishLegacyNotices as readonly string[],
      queryNorseEnglishLegacyKey: value.queryNorseEnglishLegacyKey as string,
    }),
});
export const run = tool.execute;
export default tool;
