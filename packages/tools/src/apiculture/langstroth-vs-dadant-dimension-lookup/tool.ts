import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedLangstrothDadantDimensionsKeys: readonly string[];
  readonly callerVerifiedLangstrothDadantDimensionsNotices: readonly string[];
  readonly queryLangstrothDadantDimensionsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedLangstrothDadantDimensionsKeys",
    label: "Caller verified langstroth dadant dimensions keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedLangstrothDadantDimensionsNotices",
    label: "Caller verified langstroth dadant dimensions notices",
    kind: "stringList",
  },
  {
    id: "queryLangstrothDadantDimensionsKey",
    label: "Query langstroth dadant dimensions key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedLangstrothDadantDimensionsKeys,
      input.callerVerifiedLangstrothDadantDimensionsNotices,
      input.queryLangstrothDadantDimensionsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedLangstrothDadantDimensionsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedLangstrothDadantDimensionsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryLangstrothDadantDimensionsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/langstroth-vs-dadant-dimension-lookup",
  title: "Langstroth vs Dadant Dimension Lookup",
  description:
    "Caller exact manufacturer/model independently verified Langstroth/Dadant internal/outer/frame dimensional compatibility notice. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedLangstrothDadantDimensionsKeys:
        value.callerVerifiedLangstrothDadantDimensionsKeys as readonly string[],
      callerVerifiedLangstrothDadantDimensionsNotices:
        value.callerVerifiedLangstrothDadantDimensionsNotices as readonly string[],
      queryLangstrothDadantDimensionsKey:
        value.queryLangstrothDadantDimensionsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
