import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedOverrunningPrecipKeys: readonly string[];
  readonly callerVerifiedOverrunningPrecipNotices: readonly string[];
  readonly queryOverrunningPrecipKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedOverrunningPrecipKeys",
    label: "Caller verified overrunning precip keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedOverrunningPrecipNotices",
    label: "Caller verified overrunning precip notices",
    kind: "stringList",
  },
  {
    id: "queryOverrunningPrecipKey",
    label: "Query overrunning precip key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedOverrunningPrecipKeys,
      input.callerVerifiedOverrunningPrecipNotices,
      input.queryOverrunningPrecipKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedOverrunningPrecipKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedOverrunningPrecipNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryOverrunningPrecipKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/warm-front-overrunning-precip-type-lookup",
  title: "Warm Front Overrunning Precip Type Lookup",
  description:
    "Independently matched atmospheric wet-bulb profile/front reference for overrunning precipitation type, no automatic phase from surface temperature. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedOverrunningPrecipKeys:
        value.callerVerifiedOverrunningPrecipKeys as readonly string[],
      callerVerifiedOverrunningPrecipNotices:
        value.callerVerifiedOverrunningPrecipNotices as readonly string[],
      queryOverrunningPrecipKey: value.queryOverrunningPrecipKey as string,
    }),
});
export const run = tool.execute;
export default tool;
