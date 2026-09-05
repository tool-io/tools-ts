import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSignFamilyKeys: readonly string[];
  readonly callerVerifiedSignFamilyNotices: readonly string[];
  readonly querySignFamilyKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedSignFamilyKeys",
    label: "Caller verified sign family keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSignFamilyNotices",
    label: "Caller verified sign family notices",
    kind: "stringList",
  },
  { id: "querySignFamilyKey", label: "Query sign family key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedSignFamilyKeys,
      input.callerVerifiedSignFamilyNotices,
      input.querySignFamilyKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSignFamilyKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedSignFamilyNotices: [
    "independent reference a",
    "independent reference b",
  ],
  querySignFamilyKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/sign-language-family-lookup",
  title: "Sign Language Family Lookup",
  description:
    "Independently verified language/edition sign-language family affiliation, spoken language and country do not determine sign genealogy. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedSignFamilyKeys:
        value.callerVerifiedSignFamilyKeys as readonly string[],
      callerVerifiedSignFamilyNotices:
        value.callerVerifiedSignFamilyNotices as readonly string[],
      querySignFamilyKey: value.querySignFamilyKey as string,
    }),
});
export const run = tool.execute;
export default tool;
