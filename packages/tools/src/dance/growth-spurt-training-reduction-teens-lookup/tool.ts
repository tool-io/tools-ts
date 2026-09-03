import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedGrowthSpurtLoadKeys: readonly string[];
  readonly callerVerifiedGrowthSpurtLoadNotices: readonly string[];
  readonly queryGrowthSpurtLoadKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedGrowthSpurtLoadKeys",
    label: "Caller verified growth spurt load keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedGrowthSpurtLoadNotices",
    label: "Caller verified growth spurt load notices",
    kind: "stringList",
  },
  {
    id: "queryGrowthSpurtLoadKey",
    label: "Query growth spurt load key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedGrowthSpurtLoadKeys,
      input.callerVerifiedGrowthSpurtLoadNotices,
      input.queryGrowthSpurtLoadKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedGrowthSpurtLoadKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedGrowthSpurtLoadNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryGrowthSpurtLoadKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/growth-spurt-training-reduction-teens-lookup",
  title: "Growth Spurt Training Reduction Teens Lookup",
  description:
    "Caller independently qualified clinician/teacher individual growth-spurt training review plan, not a universal teen percentage reduction. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedGrowthSpurtLoadKeys:
        value.callerVerifiedGrowthSpurtLoadKeys as readonly string[],
      callerVerifiedGrowthSpurtLoadNotices:
        value.callerVerifiedGrowthSpurtLoadNotices as readonly string[],
      queryGrowthSpurtLoadKey: value.queryGrowthSpurtLoadKey as string,
    }),
});
export const run = tool.execute;
export default tool;
