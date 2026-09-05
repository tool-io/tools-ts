import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedQuebecFrenchFeatureKeys: readonly string[];
  readonly callerVerifiedQuebecFrenchFeatureNotices: readonly string[];
  readonly queryQuebecFrenchFeatureKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedQuebecFrenchFeatureKeys",
    label: "Caller verified quebec french feature keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedQuebecFrenchFeatureNotices",
    label: "Caller verified quebec french feature notices",
    kind: "stringList",
  },
  {
    id: "queryQuebecFrenchFeatureKey",
    label: "Query quebec french feature key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedQuebecFrenchFeatureKeys,
      input.callerVerifiedQuebecFrenchFeatureNotices,
      input.queryQuebecFrenchFeatureKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedQuebecFrenchFeatureKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedQuebecFrenchFeatureNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryQuebecFrenchFeatureKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/quebecois-french-features-lookup",
  title: "Quebecois French Features Lookup",
  description:
    "Independently documented QuebecFrench variety/context feature reference. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedQuebecFrenchFeatureKeys:
        value.callerVerifiedQuebecFrenchFeatureKeys as readonly string[],
      callerVerifiedQuebecFrenchFeatureNotices:
        value.callerVerifiedQuebecFrenchFeatureNotices as readonly string[],
      queryQuebecFrenchFeatureKey: value.queryQuebecFrenchFeatureKey as string,
    }),
});
export const run = tool.execute;
export default tool;
