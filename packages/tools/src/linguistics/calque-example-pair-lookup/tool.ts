import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCalquePairKeys: readonly string[];
  readonly callerVerifiedCalquePairNotices: readonly string[];
  readonly queryCalquePairKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedCalquePairKeys",
    label: "Caller verified calque pair keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCalquePairNotices",
    label: "Caller verified calque pair notices",
    kind: "stringList",
  },
  { id: "queryCalquePairKey", label: "Query calque pair key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedCalquePairKeys,
      input.callerVerifiedCalquePairNotices,
      input.queryCalquePairKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCalquePairKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedCalquePairNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryCalquePairKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/calque-example-pair-lookup",
  title: "Calque Example Pair Lookup",
  description:
    "Independently documented translated morphology/source-target calque evidence, not automatic etymology. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedCalquePairKeys:
        value.callerVerifiedCalquePairKeys as readonly string[],
      callerVerifiedCalquePairNotices:
        value.callerVerifiedCalquePairNotices as readonly string[],
      queryCalquePairKey: value.queryCalquePairKey as string,
    }),
});
export const run = tool.execute;
export default tool;
