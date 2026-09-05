import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedHaboobEvidenceKeys: readonly string[];
  readonly callerVerifiedHaboobEvidenceNotices: readonly string[];
  readonly queryHaboobEvidenceKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedHaboobEvidenceKeys",
    label: "Caller verified haboob evidence keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedHaboobEvidenceNotices",
    label: "Caller verified haboob evidence notices",
    kind: "stringList",
  },
  {
    id: "queryHaboobEvidenceKey",
    label: "Query haboob evidence key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedHaboobEvidenceKeys,
      input.callerVerifiedHaboobEvidenceNotices,
      input.queryHaboobEvidenceKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedHaboobEvidenceKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedHaboobEvidenceNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryHaboobEvidenceKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/haboob-dust-wall-height-wind-lookup",
  title: "Haboob Dust Wall Height Wind Lookup",
  description:
    "Caller verified event/site dust-wall height/wind notice, not live hazard or universal wall height. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedHaboobEvidenceKeys:
        value.callerVerifiedHaboobEvidenceKeys as readonly string[],
      callerVerifiedHaboobEvidenceNotices:
        value.callerVerifiedHaboobEvidenceNotices as readonly string[],
      queryHaboobEvidenceKey: value.queryHaboobEvidenceKey as string,
    }),
});
export const run = tool.execute;
export default tool;
