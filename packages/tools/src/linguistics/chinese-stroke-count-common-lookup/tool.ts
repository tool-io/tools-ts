import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedHanStrokeCountKeys: readonly string[];
  readonly callerVerifiedHanStrokeCountNotices: readonly string[];
  readonly queryHanStrokeCountKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedHanStrokeCountKeys",
    label: "Caller verified han stroke count keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedHanStrokeCountNotices",
    label: "Caller verified han stroke count notices",
    kind: "stringList",
  },
  {
    id: "queryHanStrokeCountKey",
    label: "Query han stroke count key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedHanStrokeCountKeys,
      input.callerVerifiedHanStrokeCountNotices,
      input.queryHanStrokeCountKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedHanStrokeCountKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedHanStrokeCountNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryHanStrokeCountKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/chinese-stroke-count-common-lookup",
  title: "Chinese Common Character Stroke Count Lookup",
  description:
    "Independently verified Han character/form/tradition stroke-count record; simplified/traditional and glyph forms differ. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedHanStrokeCountKeys:
        value.callerVerifiedHanStrokeCountKeys as readonly string[],
      callerVerifiedHanStrokeCountNotices:
        value.callerVerifiedHanStrokeCountNotices as readonly string[],
      queryHanStrokeCountKey: value.queryHanStrokeCountKey as string,
    }),
});
export const run = tool.execute;
export default tool;
