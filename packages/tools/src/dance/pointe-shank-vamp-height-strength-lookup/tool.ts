import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPointeShoeFitKeys: readonly string[];
  readonly callerVerifiedPointeShoeFitNotices: readonly string[];
  readonly queryPointeShoeFitKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPointeShoeFitKeys",
    label: "Caller verified pointe shoe fit keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPointeShoeFitNotices",
    label: "Caller verified pointe shoe fit notices",
    kind: "stringList",
  },
  {
    id: "queryPointeShoeFitKey",
    label: "Query pointe shoe fit key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPointeShoeFitKeys,
      input.callerVerifiedPointeShoeFitNotices,
      input.queryPointeShoeFitKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPointeShoeFitKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPointeShoeFitNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPointeShoeFitKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/pointe-shank-vamp-height-strength-lookup",
  title: "Pointe Shank Vamp Height Strength Lookup",
  description:
    "Caller independently verified qualified fitter/manufacturer/model pointe shank/vamp support notice; no remote fit, readiness or sewing prescription. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedPointeShoeFitKeys:
        value.callerVerifiedPointeShoeFitKeys as readonly string[],
      callerVerifiedPointeShoeFitNotices:
        value.callerVerifiedPointeShoeFitNotices as readonly string[],
      queryPointeShoeFitKey: value.queryPointeShoeFitKey as string,
    }),
});
export const run = tool.execute;
export default tool;
