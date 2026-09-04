import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedStartupJargonKeys: readonly string[];
  readonly callerVerifiedStartupJargonNotices: readonly string[];
  readonly queryStartupJargonKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedStartupJargonKeys",
    label: "Caller verified startup jargon keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedStartupJargonNotices",
    label: "Caller verified startup jargon notices",
    kind: "stringList",
  },
  {
    id: "queryStartupJargonKey",
    label: "Query startup jargon key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedStartupJargonKeys,
      input.callerVerifiedStartupJargonNotices,
      input.queryStartupJargonKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedStartupJargonKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedStartupJargonNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryStartupJargonKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/startup-jargon-glossary-translation-lookup",
  title: "Startup Jargon Glossary Translation Lookup",
  description:
    "Caller independently verified term/context/edition jargon translation, no legal contract interpretation. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedStartupJargonKeys:
        value.callerVerifiedStartupJargonKeys as readonly string[],
      callerVerifiedStartupJargonNotices:
        value.callerVerifiedStartupJargonNotices as readonly string[],
      queryStartupJargonKey: value.queryStartupJargonKey as string,
    }),
});
export const run = tool.execute;
export default tool;
