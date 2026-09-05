import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedRpFeatureKeys: readonly string[];
  readonly callerVerifiedRpFeatureNotices: readonly string[];
  readonly queryRpFeatureKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedRpFeatureKeys",
    label: "Caller verified rp feature keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRpFeatureNotices",
    label: "Caller verified rp feature notices",
    kind: "stringList",
  },
  { id: "queryRpFeatureKey", label: "Query rp feature key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedRpFeatureKeys,
      input.callerVerifiedRpFeatureNotices,
      input.queryRpFeatureKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedRpFeatureKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedRpFeatureNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryRpFeatureKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/received-pronunciation-features-lookup",
  title: "Received Pronunciation Features Lookup",
  description:
    "Independently documented RP variety/source feature reference, not accent identification. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedRpFeatureKeys:
        value.callerVerifiedRpFeatureKeys as readonly string[],
      callerVerifiedRpFeatureNotices:
        value.callerVerifiedRpFeatureNotices as readonly string[],
      queryRpFeatureKey: value.queryRpFeatureKey as string,
    }),
});
export const run = tool.execute;
export default tool;
