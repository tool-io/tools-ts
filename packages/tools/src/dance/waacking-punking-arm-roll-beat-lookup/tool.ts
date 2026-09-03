import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedWaackingScoreKeys: readonly string[];
  readonly callerVerifiedWaackingScoreNotices: readonly string[];
  readonly queryWaackingScoreKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedWaackingScoreKeys",
    label: "Caller verified waacking score keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedWaackingScoreNotices",
    label: "Caller verified waacking score notices",
    kind: "stringList",
  },
  {
    id: "queryWaackingScoreKey",
    label: "Query waacking score key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedWaackingScoreKeys,
      input.callerVerifiedWaackingScoreNotices,
      input.queryWaackingScoreKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedWaackingScoreKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedWaackingScoreNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryWaackingScoreKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/waacking-punking-arm-roll-beat-lookup",
  title: "Waacking Punking Arm Roll Beat Lookup",
  description:
    "Caller independently source/community verified waacking/punking arm-roll accent score and context, not universal timing or historical equivalence claim. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedWaackingScoreKeys:
        value.callerVerifiedWaackingScoreKeys as readonly string[],
      callerVerifiedWaackingScoreNotices:
        value.callerVerifiedWaackingScoreNotices as readonly string[],
      queryWaackingScoreKey: value.queryWaackingScoreKey as string,
    }),
});
export const run = tool.execute;
export default tool;
