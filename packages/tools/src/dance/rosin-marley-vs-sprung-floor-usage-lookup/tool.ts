import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFloorRosinPolicyKeys: readonly string[];
  readonly callerVerifiedFloorRosinPolicyNotices: readonly string[];
  readonly queryFloorRosinPolicyKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFloorRosinPolicyKeys",
    label: "Caller verified floor rosin policy keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFloorRosinPolicyNotices",
    label: "Caller verified floor rosin policy notices",
    kind: "stringList",
  },
  {
    id: "queryFloorRosinPolicyKey",
    label: "Query floor rosin policy key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFloorRosinPolicyKeys,
      input.callerVerifiedFloorRosinPolicyNotices,
      input.queryFloorRosinPolicyKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFloorRosinPolicyKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFloorRosinPolicyNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryFloorRosinPolicyKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/rosin-marley-vs-sprung-floor-usage-lookup",
  title: "Rosin Marley vs Sprung Floor Usage Lookup",
  description:
    "Caller independently verified floor manufacturer/venue/footwear rosin policy; no chemical application or friction-safety assurance. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedFloorRosinPolicyKeys:
        value.callerVerifiedFloorRosinPolicyKeys as readonly string[],
      callerVerifiedFloorRosinPolicyNotices:
        value.callerVerifiedFloorRosinPolicyNotices as readonly string[],
      queryFloorRosinPolicyKey: value.queryFloorRosinPolicyKey as string,
    }),
});
export const run = tool.execute;
export default tool;
