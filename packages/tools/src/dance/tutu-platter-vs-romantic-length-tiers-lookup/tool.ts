import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTutuStyleDimensionsKeys: readonly string[];
  readonly callerVerifiedTutuStyleDimensionsNotices: readonly string[];
  readonly queryTutuStyleDimensionsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedTutuStyleDimensionsKeys",
    label: "Caller verified tutu style dimensions keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTutuStyleDimensionsNotices",
    label: "Caller verified tutu style dimensions notices",
    kind: "stringList",
  },
  {
    id: "queryTutuStyleDimensionsKey",
    label: "Query tutu style dimensions key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedTutuStyleDimensionsKeys,
      input.callerVerifiedTutuStyleDimensionsNotices,
      input.queryTutuStyleDimensionsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTutuStyleDimensionsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedTutuStyleDimensionsNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryTutuStyleDimensionsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/tutu-platter-vs-romantic-length-tiers-lookup",
  title: "Tutu Platter vs Romantic Length Tiers Lookup",
  description:
    "Independently verified costume style/pattern length specifications, no universal length for body types. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedTutuStyleDimensionsKeys:
        value.callerVerifiedTutuStyleDimensionsKeys as readonly string[],
      callerVerifiedTutuStyleDimensionsNotices:
        value.callerVerifiedTutuStyleDimensionsNotices as readonly string[],
      queryTutuStyleDimensionsKey: value.queryTutuStyleDimensionsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
