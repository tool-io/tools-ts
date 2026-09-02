import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedNationalFrameDimensionsKeys: readonly string[];
  readonly callerVerifiedNationalFrameDimensionsNotices: readonly string[];
  readonly queryNationalFrameDimensionsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedNationalFrameDimensionsKeys",
    label: "Caller verified national frame dimensions keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedNationalFrameDimensionsNotices",
    label: "Caller verified national frame dimensions notices",
    kind: "stringList",
  },
  {
    id: "queryNationalFrameDimensionsKey",
    label: "Query national frame dimensions key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedNationalFrameDimensionsKeys,
      input.callerVerifiedNationalFrameDimensionsNotices,
      input.queryNationalFrameDimensionsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedNationalFrameDimensionsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedNationalFrameDimensionsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryNationalFrameDimensionsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/national-hive-frame-size-lookup",
  title: "National Hive Frame Size Lookup",
  description:
    "Caller exact manufacturer/model independently verified National frame dimensional notice. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedNationalFrameDimensionsKeys:
        value.callerVerifiedNationalFrameDimensionsKeys as readonly string[],
      callerVerifiedNationalFrameDimensionsNotices:
        value.callerVerifiedNationalFrameDimensionsNotices as readonly string[],
      queryNationalFrameDimensionsKey:
        value.queryNationalFrameDimensionsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
