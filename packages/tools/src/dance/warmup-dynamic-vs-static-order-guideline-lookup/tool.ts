import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedWarmupProtocolKeys: readonly string[];
  readonly callerVerifiedWarmupProtocolNotices: readonly string[];
  readonly queryWarmupProtocolKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedWarmupProtocolKeys",
    label: "Caller verified warmup protocol keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedWarmupProtocolNotices",
    label: "Caller verified warmup protocol notices",
    kind: "stringList",
  },
  {
    id: "queryWarmupProtocolKey",
    label: "Query warmup protocol key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedWarmupProtocolKeys,
      input.callerVerifiedWarmupProtocolNotices,
      input.queryWarmupProtocolKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedWarmupProtocolKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedWarmupProtocolNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryWarmupProtocolKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/warmup-dynamic-vs-static-order-guideline-lookup",
  title: "Warmup Dynamic vs Static Order Guideline Lookup",
  description:
    "Caller independently qualified context-specific dynamic/static warmup policy; no universal safe exercise order or flexibility advice. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedWarmupProtocolKeys:
        value.callerVerifiedWarmupProtocolKeys as readonly string[],
      callerVerifiedWarmupProtocolNotices:
        value.callerVerifiedWarmupProtocolNotices as readonly string[],
      queryWarmupProtocolKey: value.queryWarmupProtocolKey as string,
    }),
});
export const run = tool.execute;
export default tool;
