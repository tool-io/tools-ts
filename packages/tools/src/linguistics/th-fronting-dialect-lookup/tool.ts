import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedThFrontingKeys: readonly string[];
  readonly callerVerifiedThFrontingNotices: readonly string[];
  readonly queryThFrontingKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedThFrontingKeys",
    label: "Caller verified th fronting keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedThFrontingNotices",
    label: "Caller verified th fronting notices",
    kind: "stringList",
  },
  { id: "queryThFrontingKey", label: "Query th fronting key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedThFrontingKeys,
      input.callerVerifiedThFrontingNotices,
      input.queryThFrontingKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedThFrontingKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedThFrontingNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryThFrontingKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/th-fronting-dialect-lookup",
  title: "TH-Fronting Dialect Lookup",
  description:
    "Independently verified dialect/context TH-fronting observations; no region stereotype or automatic speaker assignment. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedThFrontingKeys:
        value.callerVerifiedThFrontingKeys as readonly string[],
      callerVerifiedThFrontingNotices:
        value.callerVerifiedThFrontingNotices as readonly string[],
      queryThFrontingKey: value.queryThFrontingKey as string,
    }),
});
export const run = tool.execute;
export default tool;
