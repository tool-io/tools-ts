import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPolarityChronKeys: readonly string[];
  readonly callerVerifiedPolarityChronNotices: readonly string[];
  readonly queryPolarityChronKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPolarityChronKeys",
    label: "Caller verified polarity chron keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPolarityChronNotices",
    label: "Caller verified polarity chron notices",
    kind: "stringList",
  },
  {
    id: "queryPolarityChronKey",
    label: "Query polarity chron key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPolarityChronKeys,
      input.callerVerifiedPolarityChronNotices,
      input.queryPolarityChronKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPolarityChronKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedPolarityChronNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryPolarityChronKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/magnetostratigraphy-polarity-lookup",
  title: "Geology Magnetostratigraphy Polarity Lookup",
  description:
    "Resolve independently verified named polarity chron/edition evidence, not geomagnetic-age assignment without reference. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedPolarityChronKeys:
        value.callerVerifiedPolarityChronKeys as readonly string[],
      callerVerifiedPolarityChronNotices:
        value.callerVerifiedPolarityChronNotices as readonly string[],
      queryPolarityChronKey: value.queryPolarityChronKey as string,
    }),
});
export const run = tool.execute;
export default tool;
