import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedNormanFrenchPeriodKeys: readonly string[];
  readonly callerVerifiedNormanFrenchPeriodNotices: readonly string[];
  readonly queryNormanFrenchPeriodKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedNormanFrenchPeriodKeys",
    label: "Caller verified norman french period keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedNormanFrenchPeriodNotices",
    label: "Caller verified norman french period notices",
    kind: "stringList",
  },
  {
    id: "queryNormanFrenchPeriodKey",
    label: "Query norman french period key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedNormanFrenchPeriodKeys,
      input.callerVerifiedNormanFrenchPeriodNotices,
      input.queryNormanFrenchPeriodKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedNormanFrenchPeriodKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedNormanFrenchPeriodNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryNormanFrenchPeriodKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/norman-french-influence-period-lookup",
  title: "Norman French Influence Period Lookup",
  description:
    "Independently verified regional/social/lexical NormanFrench contact-period reference. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedNormanFrenchPeriodKeys:
        value.callerVerifiedNormanFrenchPeriodKeys as readonly string[],
      callerVerifiedNormanFrenchPeriodNotices:
        value.callerVerifiedNormanFrenchPeriodNotices as readonly string[],
      queryNormanFrenchPeriodKey: value.queryNormanFrenchPeriodKey as string,
    }),
});
export const run = tool.execute;
export default tool;
