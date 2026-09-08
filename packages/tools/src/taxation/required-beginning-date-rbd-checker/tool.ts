import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedRequiredBeginningDateKeys: readonly string[];
  readonly callerVerifiedRequiredBeginningDateNotices: readonly string[];
  readonly queryRequiredBeginningDateKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedRequiredBeginningDateKeys",
    label: "Caller verified required beginning date keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRequiredBeginningDateNotices",
    label: "Caller verified required beginning date notices",
    kind: "stringList",
  },
  {
    id: "queryRequiredBeginningDateKey",
    label: "Query required beginning date key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedRequiredBeginningDateKeys,
      input.callerVerifiedRequiredBeginningDateNotices,
      input.queryRequiredBeginningDateKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedRequiredBeginningDateKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedRequiredBeginningDateNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryRequiredBeginningDateKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/required-beginning-date-rbd-checker",
  title: "Required Beginning Date RBD Checker",
  description:
    "Caller exact independently verified cohort/account/employment RBD rule; dates from independent notice not invented age threshold. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedRequiredBeginningDateKeys:
        value.callerVerifiedRequiredBeginningDateKeys as readonly string[],
      callerVerifiedRequiredBeginningDateNotices:
        value.callerVerifiedRequiredBeginningDateNotices as readonly string[],
      queryRequiredBeginningDateKey:
        value.queryRequiredBeginningDateKey as string,
    }),
});
export const run = tool.execute;
export default tool;
