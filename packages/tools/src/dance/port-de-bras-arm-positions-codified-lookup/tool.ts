import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPortDeBrasMethodKeys: readonly string[];
  readonly callerVerifiedPortDeBrasMethodNotices: readonly string[];
  readonly queryPortDeBrasMethodKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPortDeBrasMethodKeys",
    label: "Caller verified port de bras method keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPortDeBrasMethodNotices",
    label: "Caller verified port de bras method notices",
    kind: "stringList",
  },
  {
    id: "queryPortDeBrasMethodKey",
    label: "Query port de bras method key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPortDeBrasMethodKeys,
      input.callerVerifiedPortDeBrasMethodNotices,
      input.queryPortDeBrasMethodKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPortDeBrasMethodKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPortDeBrasMethodNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPortDeBrasMethodKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/port-de-bras-arm-positions-codified-lookup",
  title: "Port De Bras Arm Positions Codified Lookup",
  description:
    "Exact independently verified ballet-method/edition arm-position reference; numbering varies across methods. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedPortDeBrasMethodKeys:
        value.callerVerifiedPortDeBrasMethodKeys as readonly string[],
      callerVerifiedPortDeBrasMethodNotices:
        value.callerVerifiedPortDeBrasMethodNotices as readonly string[],
      queryPortDeBrasMethodKey: value.queryPortDeBrasMethodKey as string,
    }),
});
export const run = tool.execute;
export default tool;
