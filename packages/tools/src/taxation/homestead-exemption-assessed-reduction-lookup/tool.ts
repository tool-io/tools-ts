import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedHomesteadReductionKeys: readonly string[];
  readonly callerVerifiedHomesteadReductionNotices: readonly string[];
  readonly queryHomesteadReductionKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedHomesteadReductionKeys",
    label: "Caller verified homestead reduction keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedHomesteadReductionNotices",
    label: "Caller verified homestead reduction notices",
    kind: "stringList",
  },
  {
    id: "queryHomesteadReductionKey",
    label: "Query homestead reduction key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedHomesteadReductionKeys,
      input.callerVerifiedHomesteadReductionNotices,
      input.queryHomesteadReductionKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedHomesteadReductionKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedHomesteadReductionNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryHomesteadReductionKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/homestead-exemption-assessed-reduction-lookup",
  title: "Homestead Exemption Assessed Reduction Lookup",
  description:
    "Caller independently verified jurisdiction/year/owner homestead assessed-value reduction notice. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedHomesteadReductionKeys:
        value.callerVerifiedHomesteadReductionKeys as readonly string[],
      callerVerifiedHomesteadReductionNotices:
        value.callerVerifiedHomesteadReductionNotices as readonly string[],
      queryHomesteadReductionKey: value.queryHomesteadReductionKey as string,
    }),
});
export const run = tool.execute;
export default tool;
