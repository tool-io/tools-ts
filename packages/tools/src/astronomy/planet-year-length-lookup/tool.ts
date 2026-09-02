import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPlanetYearKeys: readonly string[];
  readonly callerVerifiedPlanetYearNotices: readonly string[];
  readonly queryPlanetYearKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPlanetYearKeys",
    label: "Caller verified planet year keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPlanetYearNotices",
    label: "Caller verified planet year notices",
    kind: "stringList",
  },
  { id: "queryPlanetYearKey", label: "Query planet year key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPlanetYearKeys,
      input.callerVerifiedPlanetYearNotices,
      input.queryPlanetYearKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPlanetYearKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedPlanetYearNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPlanetYearKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/planet-year-length-lookup",
  title: "Planet Year Length Lookup",
  description:
    "Independently verified planet sidereal/epoch orbital-period reference. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedPlanetYearKeys:
        value.callerVerifiedPlanetYearKeys as readonly string[],
      callerVerifiedPlanetYearNotices:
        value.callerVerifiedPlanetYearNotices as readonly string[],
      queryPlanetYearKey: value.queryPlanetYearKey as string,
    }),
});
export const run = tool.execute;
export default tool;
