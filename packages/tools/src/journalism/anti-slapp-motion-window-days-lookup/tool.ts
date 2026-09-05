import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAntiSlappWindowKeys: readonly string[];
  readonly callerVerifiedAntiSlappWindowNotices: readonly string[];
  readonly queryAntiSlappWindowKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAntiSlappWindowKeys",
    label: "Caller verified anti slapp window keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAntiSlappWindowNotices",
    label: "Caller verified anti slapp window notices",
    kind: "stringList",
  },
  {
    id: "queryAntiSlappWindowKey",
    label: "Query anti slapp window key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAntiSlappWindowKeys,
      input.callerVerifiedAntiSlappWindowNotices,
      input.queryAntiSlappWindowKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAntiSlappWindowKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedAntiSlappWindowNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryAntiSlappWindowKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/anti-slapp-motion-window-days-lookup",
  title: "Anti SLAPP Motion Window Days Lookup",
  description:
    "Independently verified court/jurisdiction/date/trigger anti SLAPP motion calendar and exclusions; no current statutory deadline generated. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedAntiSlappWindowKeys:
        value.callerVerifiedAntiSlappWindowKeys as readonly string[],
      callerVerifiedAntiSlappWindowNotices:
        value.callerVerifiedAntiSlappWindowNotices as readonly string[],
      queryAntiSlappWindowKey: value.queryAntiSlappWindowKey as string,
    }),
});
export const run = tool.execute;
export default tool;
