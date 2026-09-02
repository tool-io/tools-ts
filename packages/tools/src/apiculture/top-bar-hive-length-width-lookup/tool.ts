import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTopBarDimensionsKeys: readonly string[];
  readonly callerVerifiedTopBarDimensionsNotices: readonly string[];
  readonly queryTopBarDimensionsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedTopBarDimensionsKeys",
    label: "Caller verified top bar dimensions keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTopBarDimensionsNotices",
    label: "Caller verified top bar dimensions notices",
    kind: "stringList",
  },
  {
    id: "queryTopBarDimensionsKey",
    label: "Query top bar dimensions key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedTopBarDimensionsKeys,
      input.callerVerifiedTopBarDimensionsNotices,
      input.queryTopBarDimensionsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTopBarDimensionsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedTopBarDimensionsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryTopBarDimensionsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/top-bar-hive-length-width-lookup",
  title: "Top Bar Hive Length Width Lookup",
  description:
    "Caller exact manufacturer/model independently verified top-bar dimensions; no universal hive geometry. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedTopBarDimensionsKeys:
        value.callerVerifiedTopBarDimensionsKeys as readonly string[],
      callerVerifiedTopBarDimensionsNotices:
        value.callerVerifiedTopBarDimensionsNotices as readonly string[],
      queryTopBarDimensionsKey: value.queryTopBarDimensionsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
