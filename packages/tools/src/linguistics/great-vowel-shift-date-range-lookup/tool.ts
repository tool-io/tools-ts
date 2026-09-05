import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedVowelShiftChronologyKeys: readonly string[];
  readonly callerVerifiedVowelShiftChronologyNotices: readonly string[];
  readonly queryVowelShiftChronologyKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedVowelShiftChronologyKeys",
    label: "Caller verified vowel shift chronology keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedVowelShiftChronologyNotices",
    label: "Caller verified vowel shift chronology notices",
    kind: "stringList",
  },
  {
    id: "queryVowelShiftChronologyKey",
    label: "Query vowel shift chronology key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedVowelShiftChronologyKeys,
      input.callerVerifiedVowelShiftChronologyNotices,
      input.queryVowelShiftChronologyKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedVowelShiftChronologyKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedVowelShiftChronologyNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryVowelShiftChronologyKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/great-vowel-shift-date-range-lookup",
  title: "Great Vowel Shift Date Range Lookup",
  description:
    "Independently verified region/feature/source GreatVowelShift chronology, not universal simultaneous date range. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedVowelShiftChronologyKeys:
        value.callerVerifiedVowelShiftChronologyKeys as readonly string[],
      callerVerifiedVowelShiftChronologyNotices:
        value.callerVerifiedVowelShiftChronologyNotices as readonly string[],
      queryVowelShiftChronologyKey:
        value.queryVowelShiftChronologyKey as string,
    }),
});
export const run = tool.execute;
export default tool;
