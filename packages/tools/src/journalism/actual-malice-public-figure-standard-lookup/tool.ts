import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedActualMaliceKeys: readonly string[];
  readonly callerVerifiedActualMaliceNotices: readonly string[];
  readonly queryActualMaliceKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedActualMaliceKeys",
    label: "Caller verified actual malice keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedActualMaliceNotices",
    label: "Caller verified actual malice notices",
    kind: "stringList",
  },
  {
    id: "queryActualMaliceKey",
    label: "Query actual malice key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedActualMaliceKeys,
      input.callerVerifiedActualMaliceNotices,
      input.queryActualMaliceKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedActualMaliceKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedActualMaliceNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryActualMaliceKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/actual-malice-public-figure-standard-lookup",
  title: "Actual Malice Public Figure Standard Lookup",
  description:
    "Independently verified jurisdiction/date/public-figure/status actual-malice standard notice; no intentional harm or error rate substituted for knowledge/reckless disregard. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedActualMaliceKeys:
        value.callerVerifiedActualMaliceKeys as readonly string[],
      callerVerifiedActualMaliceNotices:
        value.callerVerifiedActualMaliceNotices as readonly string[],
      queryActualMaliceKey: value.queryActualMaliceKey as string,
    }),
});
export const run = tool.execute;
export default tool;
