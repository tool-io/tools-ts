import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPrivateFigureStandardKeys: readonly string[];
  readonly callerVerifiedPrivateFigureStandardNotices: readonly string[];
  readonly queryPrivateFigureStandardKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPrivateFigureStandardKeys",
    label: "Caller verified private figure standard keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPrivateFigureStandardNotices",
    label: "Caller verified private figure standard notices",
    kind: "stringList",
  },
  {
    id: "queryPrivateFigureStandardKey",
    label: "Query private figure standard key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPrivateFigureStandardKeys,
      input.callerVerifiedPrivateFigureStandardNotices,
      input.queryPrivateFigureStandardKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPrivateFigureStandardKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPrivateFigureStandardNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPrivateFigureStandardKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/private-figure-negligence-standard-lookup",
  title: "Private Figure Negligence Standard Lookup",
  description:
    "Independently verified jurisdiction/date/private-figure applicable fault/dam ages notice; negligence rules not universally identical. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedPrivateFigureStandardKeys:
        value.callerVerifiedPrivateFigureStandardKeys as readonly string[],
      callerVerifiedPrivateFigureStandardNotices:
        value.callerVerifiedPrivateFigureStandardNotices as readonly string[],
      queryPrivateFigureStandardKey:
        value.queryPrivateFigureStandardKey as string,
    }),
});
export const run = tool.execute;
export default tool;
