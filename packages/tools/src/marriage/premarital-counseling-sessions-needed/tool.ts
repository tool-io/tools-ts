import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerQualifiedEstablishedPlannedCounselingSessionCount: number;
  readonly actualCompletedCounselingSessionCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerQualifiedEstablishedPlannedCounselingSessionCount",
    label: "Caller qualified established planned counseling session count",
    kind: "number",
  },
  {
    id: "actualCompletedCounselingSessionCount",
    label: "Actual completed counseling session count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.callerQualifiedEstablishedPlannedCounselingSessionCount,
    "planned",
    0,
    1000000,
  );
  bounded(input.actualCompletedCounselingSessionCount, "completed", 0, 1000000);
  return {
    signedRemainingCallerPlannedSessionCount:
      input.callerQualifiedEstablishedPlannedCounselingSessionCount -
      input.actualCompletedCounselingSessionCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerQualifiedEstablishedPlannedCounselingSessionCount: 10,
    actualCompletedCounselingSessionCount: 3,
  },
  output: { result: { signedRemainingCallerPlannedSessionCount: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/premarital-counseling-sessions-needed",
  title: "Premarital Counseling Sessions Needed Calculator",
  description:
    "Independently counselor-established plan minus actual completed sessions, no inferred clinical need or universal session recommendation. Overplan negative retained.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
