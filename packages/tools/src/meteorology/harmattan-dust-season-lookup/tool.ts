import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedHarmattanSeasonKeys: readonly string[];
  readonly callerVerifiedHarmattanSeasonNotices: readonly string[];
  readonly queryHarmattanSeasonKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedHarmattanSeasonKeys",
    label: "Caller verified harmattan season keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedHarmattanSeasonNotices",
    label: "Caller verified harmattan season notices",
    kind: "stringList",
  },
  {
    id: "queryHarmattanSeasonKey",
    label: "Query harmattan season key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedHarmattanSeasonKeys,
      input.callerVerifiedHarmattanSeasonNotices,
      input.queryHarmattanSeasonKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedHarmattanSeasonKeys: ["site-a/edition-a", "site-a/edition-b"],
  callerVerifiedHarmattanSeasonNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryHarmattanSeasonKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/harmattan-dust-season-lookup",
  title: "Harmattan Dust Season Lookup",
  description:
    "Caller location/year independently verified dust-season notice, not current air quality. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedHarmattanSeasonKeys:
        value.callerVerifiedHarmattanSeasonKeys as readonly string[],
      callerVerifiedHarmattanSeasonNotices:
        value.callerVerifiedHarmattanSeasonNotices as readonly string[],
      queryHarmattanSeasonKey: value.queryHarmattanSeasonKey as string,
    }),
});
export const run = tool.execute;
export default tool;
