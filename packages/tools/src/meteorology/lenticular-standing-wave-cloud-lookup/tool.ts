import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedLenticularCloudKeys: readonly string[];
  readonly callerVerifiedLenticularCloudNotices: readonly string[];
  readonly queryLenticularCloudKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedLenticularCloudKeys",
    label: "Caller verified lenticular cloud keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedLenticularCloudNotices",
    label: "Caller verified lenticular cloud notices",
    kind: "stringList",
  },
  {
    id: "queryLenticularCloudKey",
    label: "Query lenticular cloud key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedLenticularCloudKeys,
      input.callerVerifiedLenticularCloudNotices,
      input.queryLenticularCloudKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedLenticularCloudKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedLenticularCloudNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryLenticularCloudKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/lenticular-standing-wave-cloud-lookup",
  title: "Lenticular Standing Wave Cloud Lookup",
  description:
    "Independently verified wave-cloud reference, not evidence of safe aviation turbulence. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedLenticularCloudKeys:
        value.callerVerifiedLenticularCloudKeys as readonly string[],
      callerVerifiedLenticularCloudNotices:
        value.callerVerifiedLenticularCloudNotices as readonly string[],
      queryLenticularCloudKey: value.queryLenticularCloudKey as string,
    }),
});
export const run = tool.execute;
export default tool;
