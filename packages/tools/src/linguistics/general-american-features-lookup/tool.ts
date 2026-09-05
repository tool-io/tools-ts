import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedGeneralAmericanFeatureKeys: readonly string[];
  readonly callerVerifiedGeneralAmericanFeatureNotices: readonly string[];
  readonly queryGeneralAmericanFeatureKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedGeneralAmericanFeatureKeys",
    label: "Caller verified general american feature keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedGeneralAmericanFeatureNotices",
    label: "Caller verified general american feature notices",
    kind: "stringList",
  },
  {
    id: "queryGeneralAmericanFeatureKey",
    label: "Query general american feature key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedGeneralAmericanFeatureKeys,
      input.callerVerifiedGeneralAmericanFeatureNotices,
      input.queryGeneralAmericanFeatureKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedGeneralAmericanFeatureKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedGeneralAmericanFeatureNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryGeneralAmericanFeatureKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/general-american-features-lookup",
  title: "General American Features Lookup",
  description:
    "Independently documented GeneralAmerican variety/source feature reference, no speaker identification. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedGeneralAmericanFeatureKeys:
        value.callerVerifiedGeneralAmericanFeatureKeys as readonly string[],
      callerVerifiedGeneralAmericanFeatureNotices:
        value.callerVerifiedGeneralAmericanFeatureNotices as readonly string[],
      queryGeneralAmericanFeatureKey:
        value.queryGeneralAmericanFeatureKey as string,
    }),
});
export const run = tool.execute;
export default tool;
