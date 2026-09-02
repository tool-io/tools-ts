import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPlanetDensityKeys: readonly string[];
  readonly callerVerifiedPlanetDensityNotices: readonly string[];
  readonly queryPlanetDensityKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPlanetDensityKeys",
    label: "Caller verified planet density keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPlanetDensityNotices",
    label: "Caller verified planet density notices",
    kind: "stringList",
  },
  {
    id: "queryPlanetDensityKey",
    label: "Query planet density key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPlanetDensityKeys,
      input.callerVerifiedPlanetDensityNotices,
      input.queryPlanetDensityKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPlanetDensityKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPlanetDensityNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPlanetDensityKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/planet-mean-density-lookup",
  title: "Planet Mean Density Lookup",
  description:
    "Independently verified planet mass/radius/epoch mean-density reference. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedPlanetDensityKeys:
        value.callerVerifiedPlanetDensityKeys as readonly string[],
      callerVerifiedPlanetDensityNotices:
        value.callerVerifiedPlanetDensityNotices as readonly string[],
      queryPlanetDensityKey: value.queryPlanetDensityKey as string,
    }),
});
export const run = tool.execute;
export default tool;
