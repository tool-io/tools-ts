import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCyrillicUseCountryKeys: readonly string[];
  readonly callerVerifiedCyrillicUseCountryNotices: readonly string[];
  readonly queryCyrillicUseCountryKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedCyrillicUseCountryKeys",
    label: "Caller verified cyrillic use country keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCyrillicUseCountryNotices",
    label: "Caller verified cyrillic use country notices",
    kind: "stringList",
  },
  {
    id: "queryCyrillicUseCountryKey",
    label: "Query cyrillic use country key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedCyrillicUseCountryKeys,
      input.callerVerifiedCyrillicUseCountryNotices,
      input.queryCyrillicUseCountryKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCyrillicUseCountryKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedCyrillicUseCountryNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryCyrillicUseCountryKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/cyrillic-countries-checker",
  title: "Cyrillic-Script Countries Checker",
  description:
    "Independently verified jurisdiction/language/year Cyrillic-use reference, not language/script identity from country. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedCyrillicUseCountryKeys:
        value.callerVerifiedCyrillicUseCountryKeys as readonly string[],
      callerVerifiedCyrillicUseCountryNotices:
        value.callerVerifiedCyrillicUseCountryNotices as readonly string[],
      queryCyrillicUseCountryKey: value.queryCyrillicUseCountryKey as string,
    }),
});
export const run = tool.execute;
export default tool;
