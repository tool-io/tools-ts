import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTireExciseKeys: readonly string[];
  readonly callerVerifiedTireExciseNotices: readonly string[];
  readonly queryTireExciseKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedTireExciseKeys",
    label: "Caller verified tire excise keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTireExciseNotices",
    label: "Caller verified tire excise notices",
    kind: "stringList",
  },
  { id: "queryTireExciseKey", label: "Query tire excise key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedTireExciseKeys,
      input.callerVerifiedTireExciseNotices,
      input.queryTireExciseKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTireExciseKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedTireExciseNotices: ["caller reference a", "caller reference b"],
  queryTireExciseKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/tire-federal-excise-per-tire-lookup",
  title: "Tire Federal Excise Per Tire Lookup",
  description:
    "Caller independently verified tire load/design/year per-tire excise notice, not universal fixed tire tax. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedTireExciseKeys:
        value.callerVerifiedTireExciseKeys as readonly string[],
      callerVerifiedTireExciseNotices:
        value.callerVerifiedTireExciseNotices as readonly string[],
      queryTireExciseKey: value.queryTireExciseKey as string,
    }),
});
export const run = tool.execute;
export default tool;
