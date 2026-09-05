import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedRhoticTypeKeys: readonly string[];
  readonly callerVerifiedRhoticTypeNotices: readonly string[];
  readonly queryRhoticTypeKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedRhoticTypeKeys",
    label: "Caller verified rhotic type keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRhoticTypeNotices",
    label: "Caller verified rhotic type notices",
    kind: "stringList",
  },
  { id: "queryRhoticTypeKey", label: "Query rhotic type key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedRhoticTypeKeys,
      input.callerVerifiedRhoticTypeNotices,
      input.queryRhoticTypeKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedRhoticTypeKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedRhoticTypeNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryRhoticTypeKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/rhotics-type-lookup-by-language",
  title: "Rhotics Type By Language Lookup",
  description:
    "Caller independently documented rhotic phonetic inventory/class reference, no inference from orthographic r. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedRhoticTypeKeys:
        value.callerVerifiedRhoticTypeKeys as readonly string[],
      callerVerifiedRhoticTypeNotices:
        value.callerVerifiedRhoticTypeNotices as readonly string[],
      queryRhoticTypeKey: value.queryRhoticTypeKey as string,
    }),
});
export const run = tool.execute;
export default tool;
