import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, datedRecord } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedDate: string;
  readonly callerVerifiedPeriodStarts: readonly string[];
  readonly callerVerifiedPeriodEnds: readonly string[];
  readonly callerVerifiedRecordIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchedCallerRecordIds: readonly string[];
}>;
const inputFields = [
  { id: "observedDate", label: "Observed date", kind: "string" },
  {
    id: "callerVerifiedPeriodStarts",
    label: "Caller verified period starts",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPeriodEnds",
    label: "Caller verified period ends",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRecordIds",
    label: "Caller verified record ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerRecordIds: datedRecord(
      input.observedDate,
      input.callerVerifiedPeriodStarts,
      input.callerVerifiedPeriodEnds,
      input.callerVerifiedRecordIds,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDate: "2026-01-02",
  callerVerifiedPeriodStarts: ["2026-01-01", "2026-02-01"],
  callerVerifiedPeriodEnds: ["2026-02-01", "2026-03-01"],
  callerVerifiedRecordIds: ["a", "b"],
} satisfies Input;
export const exampleOutput = { matchedCallerRecordIds: ["a"] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/local-post-era-boundary-checker",
  title: "Local Post Legality Era Boundary Checker",
  description:
    "Check observed date against caller documented local-post era records; legal status is not inferred. All independently verified matching half-open periods retained; no implied actual entitlement. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerRecordIds",
      label: "Matched caller record ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDate: value.observedDate as string,
      callerVerifiedPeriodStarts:
        value.callerVerifiedPeriodStarts as readonly string[],
      callerVerifiedPeriodEnds:
        value.callerVerifiedPeriodEnds as readonly string[],
      callerVerifiedRecordIds:
        value.callerVerifiedRecordIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
